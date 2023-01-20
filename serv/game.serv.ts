import _ from "lodash";
import moment from "moment";
import shortid from 'shortid';
import CONN from "../glob/conn";
import { Game, GamePlayer, GameStatus, IGameMessage } from "../models/game";
import { GameLogAction, IGameLog } from "../models/game-log";
import proto from '../proto/game.proto';
import RealtimeServ from "./realtime.serv";

export class GameService {
    get GameModel() {
        return CONN.MONGO.collection('game')
    }

    get HandModel() {
        return CONN.MONGO.collection('hand')
    }

    get GameLogsModel() {
        return CONN.MONGO.collection('game_logs')
    }

    private games = new Map<string, Game>()

    newGame(playerId: string) {
        const game = new Game(shortid.generate(), playerId)
        game.lastSave = game.lastActive
        this.games.set(game.id, game)
        this.GameModel.insertOne(game.dataJSON())
        game.addLogs([{action: GameLogAction.GAME_INIT}])
        return game
    }

    async getGame(gameId: string) {
        if (!this.games.has(gameId)) { 
            const json = await this.GameModel.findOne({ id: gameId })
            this.games.set(gameId, this.gameFromJSON(json))
        }

        return this.games.get(gameId)
    }

    private gameFromJSON(js: any) {
        if (_.isEmpty(js)) return null
        const game = new Game(js.id, js.ownerId)
        Object.assign(game, js)
        game.seats = game.seats.map(s => _.isNil(s) ? '' : s)
        game.lastActive = moment(js.lastActive)
        game.lastSave = moment(js.lastSave)
        Object.assign(game, {
            players: new Map(_.map(Object.values(js.players), (p: any) => [p.id, Object.assign(new GamePlayer(p.id, game), p)]))
        })
        game.addLogs([{action: GameLogAction.GAME_INIT}])
        return game
    }

    async saveGamesIfNeeded(games: Game[]) {
        await this.saveGames(games.filter(g => g && g.lastSave.isBefore(g.lastActive)))
    }

    async save() {
        this.saveGamesIfNeeded(Array.from(this.games.values()))
    }

    private async saveGames(games: Game[]) {
        if (games.length <= 0) return
        console.log(`Save ${games.length} games`)

        // TODO: Batch & chunk writes
        games.forEach(g => g.lastSave = g.lastActive)
        await this.GameModel.bulkWrite(games.map(g => ({
            updateOne: {
                filter: { id: g.id },
                update: { $set: g.dataJSON() },
                upsert: true
            }
        })))
        const gameLogs = games.filter(g => g.logs.length > 0).map(g => {
            const logs = g.logs
            g.logs = []
            return {
                id: g.id,
                logs
            }
        })
        if (gameLogs.length > 0) {
            console.log(`Save ${gameLogs.length} game logs`)
            await this.GameLogsModel.insertMany(gameLogs)
        }

        const unsavedHands = games.flatMap(g => g.unsavedHands)
        if (unsavedHands.length > 0) {
            console.log(`Save ${unsavedHands.length} hands`)
            await this.HandModel.insertMany(unsavedHands.map(h => h.persistJSON()))
            games.forEach(g => g.unsavedHands = [])
        }
    }

    async load() {
        this.games.clear()
        try {
            const playingGames = await this.GameModel.find({ status: 'PLAYING' }).toArray()
            const games: Game[] = playingGames.map(js => this.gameFromJSON(js))
    
            games.forEach(g => {
                g.status = GameStatus.STOPPED
                this.games.set(g.id, g)
            })
        }
        catch (err) {
            console.log(err)
        }
    }

    sendUpdateToClients(game: Game) {
        if (!game.isDirty && !game.hand?.isDirty) return

        try {
            if (game.isDirty) {
                const fullData = game.toJSON()
                const fields = [...game.dirtyFields]
                if (game.hand?.isDirty) fields.push('hand')
                const data = fields.includes('*') ? fullData : _.pick(fullData, ...fields, 'id', 'time', 'noHand')
                RealtimeServ.roomBroadcast(game.id, 'update_game', proto.Game.encode(data).finish())
            }
            else {
                const data = {
                    id: game.id,
                    time: Date.now(),
                    hand: game.hand?.toJSON(true)
                }

                const encoded = proto.GameHandUpdate.encode(data).finish()
                if (!game.isDirty) {
                    RealtimeServ.roomBroadcast(game.id, 'update_hand', encoded)
                }
            }
        }
        catch (err) {
            console.log(`Send updates to client for game ${game.id} got error`)
            console.log(JSON.stringify(game))
            console.log(err)
        }

        if (game.hand?.isDirty) {
            game.hand?.unmarkDirty(proto.GameHand.encode(game.hand.toJSON(true)).finish())
        }
        game.unmarkDirty()
    }

    sendMessage(gameId: string, msg: IGameMessage) {
        RealtimeServ.roomBroadcast(gameId, 'message', msg)
    }

    playerConnect(game: Game, playerId: string, socketId: string) {
        RealtimeServ.joinRoom(game.id, socketId)
        RealtimeServ.bind(`${game.id}:${playerId}`, socketId)
        RealtimeServ.bind(game.id, socketId)
        game.addLogs([{action: GameLogAction.SOCKET_IN, player: playerId}])
    }

    async startup() {
        await this.load()

        setInterval(async () => {
            try {
                await this.save()
            }
            catch (err) {
                console.log(`Save game error`, err)
            }
        }, 2000)

        setInterval(() => {
            console.log('Start prunning games...')
            this.games.forEach(g => {
                if (!g) return
                try {
                    if (g.status !== GameStatus.STOPPED && moment().diff(g.lastActive, 'd') >= 3) {
                        console.log('Game', g.id, 'is going to be pruned')
                        g.hand = null
                        g.status = GameStatus.STOPPED
                        g.lastActive = moment()
                    }
                }
                catch (err) {
                    console.log(`Game prune ${g.id} got error`)
                    console.log(err)
                }
            })
        }, 6 * 3600 * 1000) // prunning - run every 6 hour

        setInterval(async () => {
            try {
                const removedGames = Array.from(this.games.values())
                .filter(g => g?.status !== GameStatus.PLAYING && moment().diff(g.lastActive, 'h') >= 6)

                await this.saveGamesIfNeeded(removedGames)
                removedGames.forEach(g => this.games.delete(g.id))
            }
            catch (err) {
                console.log(`Game clear cache got error`)
                console.log(err)
            }
        }, 1800 * 1000) // clear cache - run every 30 minutes

        setInterval(() => {
            this.games.forEach(g => {
                if (!g) return
                try {
                    this.sendUpdateToClients(g)
                }
                catch (err) {
                    console.log(`Game ${g.id} send update to clients error`)
                    console.log(err)
                }
            })
        }, 500)

        setInterval(() => {
            const time = Date.now()
            this.games.forEach(g => {
                if (!g?.hand) return
                try {
                    g.hand.updateHandForAutoAction(time)
                }
                catch (err) {
                    g.hand.clearAutoActionTimes()
                    console.log(`Game ${g.id} update hand for auto action error`)
                    console.log(err)
                }
            })
        }, 200)

        RealtimeServ.onSocketDisconnected = (socketId, bindings) => {
            if (!bindings) return
            bindings.forEach(id => this.games.get(id)?.addLogs([{
                action: GameLogAction.SOCKET_OUT
            }])) // TODO
        }
    }
}

export const GameServ = new GameService()
export default GameServ