import _ from "lodash";
import moment from "moment";
import HC from "../glob/hc";
import RealtimeServ from "../serv/realtime.serv";
import { AppLogicError } from "../utils/hera";
import { GameHand, GameHandStatus, HandPlayer } from "./game-hand"

export enum GameStatus {
    STOPPED = 'STOPPED',
    PAUSED = 'PAUSED',
    PLAYING = 'PLAYING',
}

export interface GameSettings {
    smallBlind: number
    bigBlind: number
    showDownTime: number
    actionTime: number
    gameSpeed: number
}

export interface IGameMessage {
    id: string
    author: string
    content: string
}

export interface IStackRequest {
    type: 'ADD' | 'SET'
    amount: number
}

export interface GameRequests {
    seatIn: _.Dictionary<number>
    seatOut: number[]
    stopGame: boolean,
    settings: GameSettings
    stack: _.Dictionary<IStackRequest>
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
    guests = new Set<string>()
    seats: string[] = Array(9).fill(null)
    hand?: GameHand = null
    dealerSeat = 0

    settings: GameSettings = {
        actionTime: 20000,
        bigBlind: 20,
        smallBlind: 10,
        gameSpeed: 500,
        showDownTime: 6000
    }

    requests: GameRequests = {
        seatIn: {},
        seatOut: [],
        stopGame: false,
        settings: null,
        stack: {}
    }

    isDirty = true
    lastActive: moment.Moment = moment()
    lastSave: moment.Moment = moment(0)

    addPlayer(playerId: string) {
        if (!this.players.has(playerId)) {
            this.players.set(playerId, new GamePlayer(playerId, this))
        }
        this.guests.delete(playerId)
    }

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

    requestSeat(playerId: string, seat: number, buyIn: number, name: string) {
        if (seat < 0 || seat > 9) throw new Error(`Invalid seat index`)
        if (this.seats[seat]) throw new Error(`This seat is taken already`)
        if (this.requestSeat[playerId]) throw new Error(`Player has requested a seat`)
        if (buyIn <= 0) throw new AppLogicError(`Buy in amount is insufficient`)
        if (!name) throw new AppLogicError(`Name cannot be empty`)
        if (Array.from(this.players.values()).find(p => p.id !== playerId && p.name === name)) {
            throw new AppLogicError(`Name ${name} is already taken`)
        }

        this.addPlayer(playerId)

        const p = this.players.get(playerId)
        p.name = name
        p.buyOut += p.stack
        p.buyIn += buyIn
        p.stack = buyIn

        if (this.hand) {
            this.requests.seatIn[playerId] = seat
        }
        else {
            this.seats[seat] = p.id
        }

        this.markDirty()
    }
    
    requestLeaveSeat(player: GamePlayer) {
        if (this.requests.seatIn[player.id]) {
            delete this.requests.seatIn[player.id]
            this.markDirty(true, false)
            return
        }

        const seat = this.seats.indexOf(player.id)
        if (seat < 0) throw new Error(`Cannot request leave seat! You are not having a seat`)
        if (this.requests.seatOut.includes(seat)) throw new Error(`Cannot request leave seat! Requested`)

        if (!this.hand) {
            this.cleanUpAndLeaveSeat(seat)
            this.markDirty()
        }
        else {
            this.requests.seatOut.push(seat)
            this.markDirty(true, false)
        }
    }

    requestStackUpdate(playerId: string, req: IStackRequest) {
        if (!this.players.has(playerId)) throw new Error(`Cannot request udpate stack! Player not found`)
        if (req.type === "SET" && req.amount <= 0) throw new Error(`Cannot request udpate stack! Set stack amount must be greater than zero`)
        if (req.type === "ADD" && req.amount === 0) {
            delete this.requests.stack[playerId]
            this.markDirty(true, false)
            return
        }
        if (!this.hand) return this.processStackUpdate(playerId, req)
        this.requests.stack[playerId] = req
        this.markDirty(true, false)
    }

    processStackUpdate(playerId: string, req: IStackRequest) {
        const player = this.players.get(playerId)
        if (!player) return
        if (req.type === "ADD") {
            if (req.amount >= 0) {
                player.buyIn += req.amount
            }
            else {
                player.buyOut -= req.amount
            }

            player.stack += req.amount
        }
        else if (req.type === "SET" && req.amount > 0) {
            player.buyOut += player.stack
            player.buyIn += req.amount
            player.stack = req.amount
        }
        this.markDirty()
    }

    cleanUpAndLeaveSeat(seat: number) {
        const pid = this.seats[seat]
        if (!pid) return
        const player = this.players.get(pid)
        if (player) {
            player.buyOut += player.stack
            player.stack = 0
        }
        this.seats[seat] = null
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
        if (this.status !== GameStatus.PLAYING) return
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
        const onlinePlayers = readyPlayers.filter(pid => RealtimeServ.getSocketsFromBinding(`${this.id}:${pid}`).length > 0)
        if (readyPlayers.length < 2 || !onlinePlayers.length) {
            this.status = GameStatus.STOPPED
            this.hand = null
            this.markDirty()
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
        this.markDirty()
    }

    handOver() {
        this.performNoHandActions()
        this.startNewHand()
        this.markDirty() 
    }

    performNoHandActions() {
        Object.entries(this.requests.seatIn).forEach(([pid, seat]) => {
            if (this.seats[seat]) throw new AppLogicError(`The seat is already taken`)
            if (this.seats.includes(pid)) throw new AppLogicError(`Player have seat already`)
            this.seats[seat] = pid
        })
        this.requests.seatIn = {}

        this.requests.seatOut.forEach((s) => this.cleanUpAndLeaveSeat(s))
        this.requests.seatOut = []

        if (this.requests.stopGame) {
            this.requests.stopGame = false
            this.hand = null
            this.status = GameStatus.STOPPED
        }

        if (this.requests.settings) {
            this.settings = this.requests.settings
            this.requests.settings = null
        }

        Object.entries(this.requests.stack).forEach(([pid, req]) => this.processStackUpdate(pid, req))
        this.requests.stack = {}

        this.markDirty()
    }

    toJSON() {
        return {
            id: this.id,
            ownerId: this.ownerId,
            status: this.status,
            seats: this.seats,
            players: _.fromPairs([...this.players.entries()].map(([pid, p]) => [pid, p.toJSON()])),
            dealerSeat: this.dealerSeat,
            settings: this.settings,
            lastActive: this.lastActive.valueOf(),
            lastSave: this.lastSave.valueOf()
        }
    }

    toJSONWithHand(player?: GamePlayer) {
        return {
            id: this.id,
            ownerId: this.ownerId,
            status: this.status,
            seats: this.seats,
            players: _.fromPairs([...this.players.entries()]),
            onlinePlayers: [...this.players.keys()].filter(pid => RealtimeServ.getSocketsFromBinding(`${this.id}:${pid}`).length > 0),
            dealerSeat: this.dealerSeat,
            lastActive: this.lastActive,
            settings: this.settings,
            requests: this.requests,
            hand: this.hand?.toJSON(player)
        }
    }

    markDirty(dirty = true, updateLastActive = true) {
        this.isDirty = dirty
        if (dirty && updateLastActive) {
            this.lastActive = moment()
        }
    }

    sendDataToClients(key: string, dataSource: (playerId: string) => any) {
        this.players.forEach((p, pid) => {
            const sockets = RealtimeServ.getSocketsFromBinding(`${this.id}:${pid}`)
            if (!sockets.length) return

            const data = dataSource(pid)
            if (!data) return

            sockets.forEach(s => s.emit(key, data))
        })

        if (this.guests.size > 0) {
            this.guests.forEach(gid => {
                const sockets = RealtimeServ.getSocketsFromBinding(`${this.id}:${gid}`)
                if (!sockets.length) return

                const data = dataSource(gid)
                if (!data) return

                sockets.forEach(s => s.emit(key, data))
            })
        }
    }

    sendUpdateToClients() {
        if (!this.isDirty && !this.hand?.isDirty) return
        this.isDirty = false
        this.hand?.markDirty(false)

        this.sendDataToClients('update', (pid) => this.toJSONWithHand(this.players.get(pid)))
    }

    sendMessage(msg: IGameMessage) {
        this.sendDataToClients('message', () => msg)
    }

    connect(playerId: string, socketId: string) {
        if (!this.players.has(playerId)) {
            this.guests.add(playerId)
        }

        RealtimeServ.bind(`${this.id}:${playerId}`, socketId)
        RealtimeServ.bind(this.id, socketId)
        this.markDirty(true, false)
    }
}

export enum GamePlayerStatus {
    ACTIVE = 'ACTIVE',
    AWAY = 'AWAY',
}

export class GamePlayer {
    name: string
    status: GamePlayerStatus = GamePlayerStatus.ACTIVE
    stack: number = 0
    buyIn: number = 0
    buyOut: number = 0

    constructor(public id: string, public game: Game) {
        this.name = id
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            status: this.status,
            stack: this.stack,
            buyIn: this.buyIn,
            buyOut: this.buyOut
        }
    }
}