import _ from "lodash";
import moment from "moment";
import shortid from "shortid";
import RealtimeServ from "../serv/realtime.serv";
import { AppLogicError } from "../utils/hera";
import { GameHand, GameHandStatus, HandPlayer } from "./game-hand";
import { GameLogAction, gameLogUpdateFields, IGameLog, PersistedLogActions } from "./game-log";
import sha256 from 'crypto-js/sha256'

export enum GameStatus {
    STOPPED = 'STOPPED',
    PAUSED = 'PAUSED',
    PLAYING = 'PLAYING',
    CLOSED = 'CLOSED'
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
    mode: 'ADD' | 'SET'
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
    constructor(id: string, seed: string, ownerId: string) {
        this.id = id
        this.seed = seed
        this.ownerId = ownerId;
    }

    id: string;
    seed: string
    ownerId: string;
    status: GameStatus = GameStatus.STOPPED
    players: Map<string, GamePlayer> = new Map()
    seats: string[] = Array(9).fill('')
    hand?: GameHand = null
    
    handCount = 0
    lastPot = 0
    dealerSeat = 0

    settings: GameSettings = {
        actionTime: 20000,
        bigBlind: 20,
        smallBlind: 10,
        gameSpeed: 500,
        showDownTime: 4000
    }

    requests: GameRequests = {
        seatIn: {},
        seatOut: [],
        stopGame: false,
        settings: null,
        stack: {}
    }

    dirtyFields = new Set<string>()
    get isDirty() { return this.dirtyFields.size > 0 }

    lastActive: moment.Moment = moment()
    lastSave: moment.Moment = moment(0)

    unsavedHands: GameHand[] = []
    logs: IGameLog[] = []

    nextHandId() {
        return ++this.handCount
    }

    addPlayer(playerId: string) {
        if (!this.players.has(playerId)) {
            this.players.set(playerId, new GamePlayer(playerId, this))
        }
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
        if (this.requests.seatIn[playerId]) throw new Error(`Player has requested a seat`)
        if (this.seats.includes(playerId)) throw new Error(`Player is already having a seat`)
        if (buyIn <= 0) throw new AppLogicError(`Buy in amount is insufficient`)
        if (!name) throw new AppLogicError(`Name cannot be empty`)
        if (Array.from(this.players.values()).find(p => p.id !== playerId && p.name === name)) {
            throw new AppLogicError(`Name ${name} is already taken`)
        }

        this.addPlayer(playerId)

        const p = this.players.get(playerId)
        const orgStack = p.stack
        p.name = name
        p.buyOut += p.stack
        p.buyIn += buyIn
        p.stack = buyIn

        this.addLogs([{
            action: GameLogAction.REQUEST_SEAT_IN,
            player: playerId,
            buyIn: buyIn,
            buyOut: p.buyOut,
            stack: orgStack,
            name,
            seat
        }])

        if (this.hand) {
            this.requests.seatIn[playerId] = seat
        }
        else {
            this.seats[seat] = p.id
            this.players.get(playerId).status = GamePlayerStatus.ACTIVE
            this.addLogs([{
                action: GameLogAction.SEAT_IN,
                player: playerId,
                seat
            }])
        }

    }
    
    requestLeaveSeat(player: GamePlayer) {
        if (this.requests.seatIn[player.id]) {
            this.addLogs([{
                action: GameLogAction.REQUEST_SEAT_OUT,
                player: player.id,
                seat: this.requests.seatIn[player.id]
            }])
            delete this.requests.seatIn[player.id]
            return
        }

        const seat = this.seats.indexOf(player.id)
        if (seat < 0) throw new Error(`Cannot request leave seat! You are not having a seat`)
        if (this.requests.seatOut.includes(seat)) throw new Error(`Cannot request leave seat! Requested`)

        if (!this.hand) {
            this.cleanUpAndLeaveSeat(seat)
        }
        else {
            this.requests.seatOut.push(seat)
            this.addLogs([{
                action: GameLogAction.REQUEST_SEAT_OUT,
                player: player.id,
                seat
            }])
        }
    }
    
    requestAway(player: GamePlayer) {
        if (player.status !== GamePlayerStatus.ACTIVE) throw new Error(`Cannot request away. Player is not active`)
        player.status = GamePlayerStatus.AWAY
        this.addLogs([{
            action: GameLogAction.SET_AWAY,
            player: player.id
        }])
    }
    
    requestActive(player: GamePlayer) {
        player.status = GamePlayerStatus.ACTIVE
        this.requests.seatOut = this.requests.seatOut.filter(seat => this.seats[seat] !== player.id)
        this.addLogs([{
            action: GameLogAction.SET_ACTIVE,
            player: player.id
        }])
    }

    requestStackUpdate(playerId: string, req: IStackRequest) {
        if (!this.players.has(playerId)) throw new Error(`Cannot request udpate stack! Player not found`)
        if (req.mode === "SET" && req.amount <= 0) throw new Error(`Cannot request udpate stack! Set stack amount must be greater than zero`)
        if (req.mode === "ADD" && req.amount === 0) {
            this.addLogs([{
                action: GameLogAction.REQUEST_STACK_ADD,
                player: playerId,
                amount: req.amount
            }])
            delete this.requests.stack[playerId]
            return
        }
        if (!this.hand) return this.processStackUpdate(playerId, req)
        this.requests.stack[playerId] = req
        this.addLogs([{
            action: req.mode === "ADD" ? GameLogAction.REQUEST_STACK_ADD : GameLogAction.REQUEST_STACK_SET,
            player: playerId,
            amount: req.amount
        }])
    }

    processStackUpdate(playerId: string, req: IStackRequest) {
        const player = this.players.get(playerId)
        if (!player) return

        if (req.mode === "ADD") {
            if (req.amount >= 0) {
                player.buyIn += req.amount
            }
            else {
                player.buyOut -= req.amount
            }

            player.stack += req.amount
        }
        else if (req.mode === "SET" && req.amount > 0) {
            player.buyOut += player.stack
            player.buyIn += req.amount
            player.stack = req.amount
        }
        
        this.addLogs([{
            action: req.mode === "ADD" ? GameLogAction.STACK_ADD : GameLogAction.STACK_SET,
            player: playerId,
            stack: player.stack,
            buyIn: player.buyIn,
            buyOut: player.buyOut,
            amount: req.amount
        }])
    }

    cleanUpAndLeaveSeat(seat: number) {
        const pid = this.seats[seat]
        if (!pid) return
        const player = this.players.get(pid)
        player.status = GamePlayerStatus.ACTIVE
        const orgStack = player.stack
        if (player) {
            player.buyOut += player.stack
            player.stack = 0
        }
        this.seats[seat] = ''

        this.addLogs([{
            action: GameLogAction.SEAT_OUT,
            player: player.id,
            buyOut: player.buyOut,
            stack: orgStack,
            seat
        }])
    }

    start() {
        if (this.status !== GameStatus.STOPPED) throw new Error(`Cannot start game, invalid game status`)
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
                    this.seats[idx] = ''
                }
            }
        })

        const readyPlayers = this.getReadyPlayers()
        const onlinePlayers = readyPlayers.filter(pid => RealtimeServ.getSocketsFromBinding(`${this.id}:${pid}`).length > 0)
        if (readyPlayers.length < 2 || !onlinePlayers.length) {
            this.status = GameStatus.STOPPED
            this.hand = null
            this.addLogs([{action: GameLogAction.GAME_STOP}])
            return
        }

        do {
            this.dealerSeat = (this.dealerSeat + 1) % this.seats.length
        } while (!this.seats[this.dealerSeat])

        const handPlayers = _.range(this.seats.length)
            .map(i => (i + this.dealerSeat + 1) % this.seats.length)
            .filter(i => this.seats[i])
            .map(i => new HandPlayer(this.players.get(this.seats[i]), i))
        const hand = new GameHand(this, handPlayers)
        this.hand = hand

        hand.start()
        this.addLogs([{action: GameLogAction.NEW_HAND, handId: hand.id}])
    }

    handOver() {
        const hand = this.hand
        if (hand) {
            this.unsavedHands.push(hand)
            this.addLogs([{action: GameLogAction.HAND_OVER, handId: hand.id, totalPot: hand.committedPot}])
            this.lastPot = hand.committedPot
        }

        this.performNoHandActions()
        this.startNewHand()
    }

    performNoHandActions() {
        Object.entries(this.requests.seatIn).forEach(([pid, seat]) => {
            if (this.seats[seat]) throw new AppLogicError(`The seat is already taken`)
            if (this.seats.includes(pid)) throw new AppLogicError(`Player have seat already`)
            this.seats[seat] = pid
            this.players.get(pid).status = GamePlayerStatus.ACTIVE
            this.addLogs([{
                action: GameLogAction.SEAT_IN,
                player: pid,
                seat
            }])
        })
        this.requests.seatIn = {}

        this.requests.seatOut.forEach((s) => this.cleanUpAndLeaveSeat(s))
        this.requests.seatOut = []

        if (this.requests.stopGame) {
            this.requests.stopGame = false
            this.hand = null
            this.status = GameStatus.STOPPED
            this.addLogs([{action: GameLogAction.GAME_STOP}])
        }

        if (this.requests.settings) {
            this.settings = this.requests.settings
            this.addLogs([{action: GameLogAction.UPDATE_SETTINGS, settings: this.settings}])
            this.requests.settings = null
        }

        Object.entries(this.requests.stack).forEach(([pid, req]) => this.processStackUpdate(pid, req))
        this.requests.stack = {}
    }

    dataJSON() {
        return {
            id: this.id,
            ownerId: this.ownerId,
            status: this.status,
            seats: this.seats,
            seed: this.seed,
            players: _.fromPairs([...this.players.entries()].map(([pid, p]) => [pid, p.toJSON()])),
            dealerSeat: this.dealerSeat,
            handCount: this.handCount,
            lastPOt: this.lastPot,
            settings: this.settings,
            lastActive: this.lastActive.valueOf(),
            lastSave: this.lastSave.valueOf()
        }
    }

    toJSON(includeSteps = false) {
        return {
            id: this.id,
            ownerId: this.ownerId,
            status: this.status,
            seats: this.seats,
            players: _.fromPairs([...this.players.entries()]),
            onlinePlayers: [...this.players.keys()].filter(pid => RealtimeServ.getSocketsFromBinding(`${this.id}:${pid}`).length > 0),
            dealerSeat: this.dealerSeat,
            settings: this.settings,
            requests: this.requests,
            time: Date.now(),
            hand: this.hand?.toJSON(includeSteps),
            noHand: !this.hand,
            seed: this.status === GameStatus.CLOSED ? this.seed : null
        }
    }

    addLogs(logs: IGameLog[]) {
        const now = Date.now()
        logs.forEach(log => {
            log.time = now
            gameLogUpdateFields(log.action).forEach(f => this.dirtyFields.add(f))
            if (log.action !== GameLogAction.SOCKET_IN && log.action !== GameLogAction.SOCKET_OUT) {
                this.logs.push(log)
            }
        })

        if (logs.find(log => PersistedLogActions.has(log.action))) {
            this.lastActive = moment()
        }
    }

    unmarkDirty() {
        this.dirtyFields.clear()
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