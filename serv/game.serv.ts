import { Game, GamePlayer, GameStatus } from "../models/game";
import shortid from 'shortid';
import fs = require('fs-extra')
import moment from "moment";
import _ from "lodash";
import CONN from "../glob/conn";

export class GameService {
    get DB() {
        return CONN.MONGO.collection('game')
    }

    private games = new Map<string, Game>()

    newGame(playerId: string) {
        const game = new Game(shortid.generate(), playerId)
        game.lastSave = game.lastActive
        this.games.set(game.id, game)
        this.DB.insertOne(game.toJSON())
        return game
    }

    async getGame(gameId: string) {
        if (!this.games.has(gameId)) { 
            const json = await this.DB.findOne({ id: gameId })
            this.games.set(gameId, this.gameFromJSON(json))
        }

        return this.games.get(gameId)
    }

    private gameFromJSON(js: any) {
        if (_.isEmpty(js)) return null
        const game = new Game(js.id, js.ownerId)
        Object.assign(game, js)
        game.lastActive = moment(js.lastActive)
        game.lastSave = moment(js.lastSave)
        game.players = new Map(_.map(Object.values(js.players), (p: any) => [p.id, Object.assign(new GamePlayer(p.id, game), p)]))
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
        games.forEach(g => g.lastSave = g.lastActive)
        console.log(`Save ${games.length} games`)
        return await this.DB.bulkWrite(games.map(g => ({
            updateOne: {
                filter: { id: g.id },
                update: { $set: g.toJSON() },
                upsert: true
            }
        })))
    }

    async load() {
        this.games.clear()
        try {
            const playingGames = await this.DB.find({ status: 'PLAYING' }).toArray()
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

    async startup() {
        await this.load()
        setInterval(async () => {
            try {
                await this.save()
            }
            catch (err) {
                console.log(`Save game error`, err)
            }
        }, 1000)

        setInterval(() => {
            console.log('Start prunning games...')
            this.games.forEach(g => {
                if (!g) return
                try {
                    if (g.status === GameStatus.PLAYING && moment().diff(g.lastActive, 'd') >= 3) {
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
            const removedGames = Array.from(this.games.values())
                .filter(g => g.status === GameStatus.STOPPED && moment().diff(g.lastActive, 'h') >= 6)

            await this.saveGamesIfNeeded(removedGames)
            removedGames.forEach(g => this.games.delete(g.id))
        }, 1800 * 1000) // clear cache - run every 30 minutes

        setInterval(() => {
            this.games.forEach(g => {
                if (!g) return
                try {
                    g.sendUpdateToClients()
                }
                catch (err) {
                    console.log(`Game ${g.id} send update to clients error`)
                    console.log(err)
                }
            })
        }, 200)
    }
}

export const GameServ = new GameService()
export default GameServ