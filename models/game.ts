import _ from "lodash";
import moment from "moment";
import { GameHand, HandPlayer } from "./game-hand"

export enum GameStatus {
    STOPPED = 'STOPPED',
    PLAYING = 'PLAYING',
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
    hand?: GameHand = null
    dealerSeat = 0
    lastActive: moment.Moment = moment()

    getPlayerAt(seat: number) {
        if (seat < 0 || seat >= this.seats.length) return null
        return this.players.get(this.seats[seat])
    }

    join(player: GamePlayer) {
        this.players.set(player.id, player)
    }

    takeSeat(id: string, seatIndex: number) {
        if (seatIndex < 0 || seatIndex >= 9) throw new Error(`Invalid seat index`)
        if (this.seats[seatIndex]) throw new Error(`This seat is taken already`)
        const p = this.players.get(id)
        if (!p) throw new Error(`Cannot find play with id ${id}`)
        this.seats[seatIndex] = p.id
    }

    start() {
        if (this.status !== GameStatus.STOPPED) throw new Error(`Cannot start game, invalid game state`)
        const activePlayers = this.seats.filter(pid => this.players.get(pid)?.status === GamePlayerStatus.ACTIVE)
        if (activePlayers.length < 2) throw new Error(`Cannot start game, players are inactive`)
        this.status = GameStatus.PLAYING
        this.startNewHand()
    }

    startNewHand() {
        if (this.status !== GameStatus.PLAYING) throw new Error(`Cannot start new hand, invalid game state`)
        if (this.hand) throw new Error(`Cannot start new hand, already having an incompleted game`)
        const activePlayers = this.seats.filter(pid => this.players.get(pid)?.status === GamePlayerStatus.ACTIVE)
        if (activePlayers.length < 2) {
            this.status = GameStatus.STOPPED
            return
        }

        while (!this.seats[this.dealerSeat]) {
            this.dealerSeat = (this.dealerSeat + 1) % this.seats.length
        }

        const hand = new GameHand()
        hand.players = _.range(this.seats.length)
            .map(i => (i + this.dealerSeat + 1) % this.seats.length)
            .filter(i => this.seats[i])
            .map(i => new HandPlayer(this.players.get(this.seats[i]), i))
        this.hand = hand

        hand.start()
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
}

export enum GamePlayerStatus {
    ACTIVE = 'ACTIVE',
    AWAY = 'AWAY',
}

export class GamePlayer {
    status: GamePlayerStatus = GamePlayerStatus.ACTIVE
    bank: number = 0

    constructor(public id: string, public game: Game) {
        
    }

    toJSON() {
        return {
            id: this.id,
            status: this.status,
            bank: this.bank
        }
    }
}