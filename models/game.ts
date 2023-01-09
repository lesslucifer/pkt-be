import _ from "lodash";
import moment from "moment";
import RealtimeServ from "../serv/realtime.serv";
import { AppLogicError } from "../utils/hera";
import { GameHand, GameHandStatus, HandPlayer } from "./game-hand"

export enum GameStatus {
    STOPPED = 'STOPPED',
    PLAYING = 'PLAYING',
}

export interface INoHandAction {
    action: string
    params: _.Dictionary<any>
}

export class Game {
    constructor(id: string, ownerId: string) {
        this.id = id;
        this.ownerId = ownerId;
    }

    id: string;
    ownerId: string;
    status: GameStatus = GameStatus.STOPPED
    players: Map<string, GamePlayer> = new Map()
    seats: string[] = Array(9).fill(null)
    noHandActions: INoHandAction[] = []
    hand?: GameHand = null
    dealerSeat = 0
    lastActive: moment.Moment = moment()

    getReadyPlayers() {
        return this.seats.filter(pid => {
            const player = this.players.get(pid)
            return player && player.stack > 0 && player.status === GamePlayerStatus.ACTIVE
        })
    }

    getPlayerAt(seat: number) {
        if (seat < 0 || seat >= this.seats.length) return null
        return this.players.get(this.seats[seat])
    }

    join(player: GamePlayer) {
        player.status = GamePlayerStatus.ACTIVE
        this.players.set(player.id, player)
    }

    takeSeat(id: string, seatIndex: number) {
        if (seatIndex < 0 || seatIndex >= 9) throw new Error(`Invalid seat index`)
        if (this.seats[seatIndex]) throw new Error(`This seat is taken already`)
        const p = this.players.get(id)
        if (!p) throw new Error(`Cannot find play with id ${id}`)
        if (p.stack <= 0) throw new Error(`Cannot take seat with empty stack`)
        this.seats[seatIndex] = p.id
    }

    start() {
        const readyPlayers = this.getReadyPlayers()
        if (readyPlayers.length < 2) throw new Error(`Cannot start game, players are inactive`)
        this.status = GameStatus.PLAYING
        if (!this.hand || this.hand.status === GameHandStatus.OVER) {
            this.startNewHand()
        }
    }

    startNewHand() {
        if (this.status !== GameStatus.PLAYING) throw new Error(`Cannot start new hand, invalid game state`)
        if (this.hand && this.hand.status !== GameHandStatus.OVER) throw new Error(`Cannot start new hand, already having an incompleted game`)

        this.players.forEach(p => {
            if (p.stack <= 0) {
                const idx = this.seats.indexOf(p.id)
                if (idx >= 0) {
                    this.seats[idx] = null
                }
            }
        })

        const readyPlayers = this.getReadyPlayers()
        if (readyPlayers.length < 2) {
            this.status = GameStatus.STOPPED
            return
        }

        do {
            this.dealerSeat = (this.dealerSeat + 1) % this.seats.length
        } while (!this.seats[this.dealerSeat])

        const hand = new GameHand(this)
        hand.players = _.range(this.seats.length)
            .map(i => (i + this.dealerSeat + 1) % this.seats.length)
            .filter(i => this.seats[i])
            .map(i => new HandPlayer(this.players.get(this.seats[i]), i))
        this.hand = hand

        hand.start()
    }

    handOver() {
        const noHandActions = this.noHandActions
        this.noHandActions = []
        noHandActions.forEach(action => this.performNoHandAction(action))
        this.hand = null
        setTimeout(() => this.startNewHand(), 500)
    }

    addNoHandAction(action: INoHandAction) {
        if (!this.hand) {
            this.performNoHandAction(action)
        }
        else {
            this.noHandActions.push(action)
        }
    }

    performNoHandAction(action: INoHandAction) {
        if (action.action === 'TAKE_SEAT') {
            const { playerId, seat, buyIn } = action.params

            if (this.seats[seat]) throw new AppLogicError(`The seat is already taken`)
            if (!this.players.has(playerId)) {
                this.players.set(playerId, new GamePlayer(playerId, this))
            }

            const gamePlayer = this.players.get(playerId)
            if (this.seats.includes(playerId)) throw new AppLogicError(`Player have seat already`)
            if (buyIn <= 0) throw new AppLogicError(`Buy in amount is insufficient`)

            gamePlayer.buyOut += gamePlayer.stack
            gamePlayer.buyIn += buyIn
            gamePlayer.stack = buyIn
            this.seats[seat] = gamePlayer.id
        }
        else if (action.action === 'LEAVE_SEAT') {
            const idx = this.seats.findIndex(s => s === action.params.playerId)
            if (idx >= 0) this.seats[idx] = null
            const player = this.players.get(action.params.playerId)
            if (player) {
                player.buyOut += player.stack
                player.stack = 0
            }
        }
    }

    toJSON() {
        return {
            id: this.id,
            ownerId: this.ownerId,
            status: this.status,
            seats: this.seats,
            players: _.fromPairs([...this.players.entries()]),
            dealerSeat: this.dealerSeat,
            lastActive: this.lastActive
        }
    }

    toJSONWithHand(player?: GamePlayer) {
        return {
            id: this.id,
            ownerId: this.ownerId,
            status: this.status,
            seats: this.seats,
            players: _.fromPairs([...this.players.entries()]),
            dealerSeat: this.dealerSeat,
            lastActive: this.lastActive,
            hand: this.hand?.toJSON(player)
        }
    }

    updateToClients() {
        this.players.forEach((p, pid) => {
            console.log(`Send update to player ${p.id}`)
            const sockets = RealtimeServ.getSocketsFromBinding(`${this.id}:${pid}`)
            if (!sockets.length) return

            console.log(`Send update to player ${p.id}`)
            const data = this.toJSONWithHand(p)
            sockets.forEach(s => s.emit('update', data))
        })
    }

    connect(playerId: string, socketId: string) {
        if (!this.players.has(playerId)) throw new AppLogicError(`Cannot connect to socketio, player not found`, 404)
        RealtimeServ.bind(`${this.id}:${playerId}`, socketId)
    }
}

export enum GamePlayerStatus {
    ACTIVE = 'ACTIVE',
    AWAY = 'AWAY',
}

export class GamePlayer {
    status: GamePlayerStatus = GamePlayerStatus.ACTIVE
    stack: number = 0
    buyIn: number = 0
    buyOut: number = 0

    constructor(public id: string, public game: Game) {
        
    }

    toJSON() {
        return {
            id: this.id,
            status: this.status,
            stack: this.stack
        }
    }
}