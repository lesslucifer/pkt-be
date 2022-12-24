import _ from "lodash";
import shortid from "shortid";
import hera, { AppLogicError } from "../utils/hera";
import { Card, Deck, MASKED_CARD } from "./card";
import { Game, GamePlayer, GameStatus } from "./game";
import { PokerHand, PokerHandResult } from "./poker-hand";

export enum HandPlayerStatus {
    PLAYING = 'PLAYING',
    FOLDED = 'FOLDED',
    ALL_IN = 'ALL_IN'
}

export enum HandRound {
    PRE_FLOP = 'PRE_FLOP',
    FLOP = 'FLOP',
    TURN = 'TURN',
    RIVER = 'RIVER',
    DONE = 'DONE',
}

export class HandPlayer {
    player: GamePlayer
    seatIndex: number
    cards: Card[]
    status: HandPlayerStatus = HandPlayerStatus.PLAYING
    result?: PokerHandResult
    betting = 0
    showCard = false

    constructor(p: GamePlayer, seatIndex: number) {
        this.player = p
        this.seatIndex = seatIndex
    }

    toJSON(player?: GamePlayer) {
        return {
            player: this.player.toJSON(),
            seatIndex: this.seatIndex,
            status: this.status,
            betting: this.betting,
            cards: this.cardJSON(player)
        }
    }

    cardJSON(player?: GamePlayer) {
        if (!this.cards.length && this.showCard || player?.id === this.player.id) {
            return this.cards
        }

        return [MASKED_CARD, MASKED_CARD]
    }
}


export enum ActionType {
    BET = 'BET',
    FOLD = 'FOLD',
    TIME = 'TIME'
}

export interface IPlayerAction {
    action: ActionType
    amount?: number
}

export enum GameHandStatus {
    READY = 'READY',
    PLAYING = 'PLAYING',
    AUTO = 'AUTO',
    SHOWING_DOWN = 'SHOWING_DOWN',
    OVER = 'OVER',
}

export class GameHand {
    id: string
    deck: Deck = new Deck()
    players: HandPlayer[]
    roundPlayers: number[]
    status: GameHandStatus = GameHandStatus.READY
    round: HandRound = HandRound.PRE_FLOP
    communityCards: Card[] = []
    pot = 0
    betting = 0
    minRaise = 0

    constructor(public game: Game) {
        this.id = `${game.id}:${shortid.generate()}`
    } 

    get fullPot() {
        return this.pot + _.sumBy(this.players, p => p.betting)
    }

    start() {
        this.deal()

        this.status = GameHandStatus.PLAYING

        this.roundPlayers = [0]
        this.bet(this.players[0], 10)
        this.roundPlayers = [1]
        this.bet(this.players[1], 20)

        if (!this.checkTerminatedHand()) {
            this.roundPlayers = hera.rotate(_.range(this.players.length), 2)
            this.round = HandRound.PRE_FLOP
            this.betting = 20
            this.minRaise = 20
        }
    }

    deal() {
        if (this.status !== GameHandStatus.READY) throw new Error(`Cannot deal, invalid status`)
        // check the players is not dealt
        
        this.deck.shuffle()
        this.players.forEach(p => {
            p.cards = [this.deck.deal(), this.deck.deal()]
        })
    }

    bet(player: HandPlayer, amount: number) {
        if (this.status !== GameHandStatus.PLAYING) throw new Error(`The hand is not playing`)
        if (this.round === HandRound.DONE) throw new Error(`The hand is over`)
        
        const index = this.roundPlayers[0]
        if (!this.roundPlayers.length || this.players[index] !== player) throw new Error(`Invalid betting player`)

        const maxOtherBet = _.maxBy(this.players, p => (p === player || p.status !== HandPlayerStatus.PLAYING ? 0 : p.player.stack)).player.stack
        const maxBet = Math.min(player.player.stack, maxOtherBet)
        if (amount >= maxBet) { // all in
            amount = maxBet
            player.status = HandPlayerStatus.ALL_IN
        }
        else if (amount > this.betting) { // raise
            if (amount - this.betting < this.minRaise) throw Error(`Invalid betting amount, to low raise, at least ${this.minRaise}`)
            if (this.players.find(p => p.status === HandPlayerStatus.ALL_IN)) throw Error(`Cannot raise, there was a player alled in`)
        }
        else if (amount < this.betting) {
            throw Error(`Invalid betting amount, to low bet. Current betting is ${this.betting}`)
        }
        
        if (amount > this.betting) {
            const nextPlayers = _.range(this.players.length)
            .map(i => (i + index) % this.players.length)
            .filter(i => !this.roundPlayers.includes(i) && this.players[i].status === HandPlayerStatus.PLAYING)
            this.roundPlayers.push(...nextPlayers)
        }

        const betAmount = Math.max(0, amount - player.betting)

        this.minRaise = Math.max(this.minRaise, amount - this.betting)
        this.betting = Math.max(this.betting, amount)

        player.betting = Math.min(amount, player.player.stack)
    }

    moveNext() {
        if (this.status !== GameHandStatus.PLAYING && this.status !== GameHandStatus.AUTO) throw new Error(`The hand is not playing`)
        if (this.round === HandRound.DONE) throw new Error(`The hand is over`)
        if (!this.roundPlayers.length) throw new Error(`Invalid hand state. No current player??`)

        this.roundPlayers.shift() // TODO
        if (this.roundPlayers.length <= 0) {
            this.completeRound()
        }
    }

    completeRound() {
        if (this.status !== GameHandStatus.PLAYING && this.status !== GameHandStatus.AUTO) throw new Error(`The hand is not playing`)
        if (this.round === HandRound.DONE) throw new Error(`The hand is over`)

        this.commitPot()

        this.round = GameHand.nextRound(this.round)
        this.betting = 0
        this.minRaise = 20
        this.roundPlayers = _.range(this.players.length).filter(i => this.players[i].status === HandPlayerStatus.PLAYING)
        if (this.round === HandRound.DONE) {
            this.completeHand()
            return
        }

        this.dealNextRound()
    }

    commitPot() {
        this.players.forEach(p => {
            const betAmount = Math.min(p.player.stack, p.betting)
            p.player.stack -= betAmount
            this.pot += betAmount
            p.betting = 0
        })
    }

    dealNextRound() {
        if (this.status !== GameHandStatus.PLAYING && this.status !== GameHandStatus.AUTO) throw new Error(`The hand is not playing`)
        if (this.round === HandRound.DONE) throw new Error(`The round is done`)

        if (this.round === HandRound.FLOP) {
            this.deck.deal() // burn
            this.communityCards.push(this.deck.deal())
            this.communityCards.push(this.deck.deal())
            this.communityCards.push(this.deck.deal())
        }
        else if (this.round === HandRound.TURN || this.round == HandRound.RIVER) {
            this.deck.deal() // burn
            this.communityCards.push(this.deck.deal())
        }
    }

    completeHand() {
        if (this.round !== HandRound.DONE) throw new Error(`The hand is not done yet`)
        if (this.status !== GameHandStatus.PLAYING && this.status !== GameHandStatus.AUTO) throw new Error(`The hand is not playing`)
        
        const players = this.players.filter(p => p.status !== HandPlayerStatus.FOLDED)
        players.forEach(p => p.result = PokerHand.calcHand(p.cards, this.communityCards))

        console.log(`Complete hand`)
        console.log(`Comunity cards`, this.communityCards.map(c => c.desc))
        console.log(`Players`, players.map(p => ({
            id: p.player.id,
            cards: p.cards.map(c => c.desc),
            result: p.result
        })))

        let winners = [players[0]]
        for (let i = 1; i < players.length; ++i) {
            const cmp = PokerHand.compare(players[i].result, winners[0].result)
            if (cmp > 0) winners = [players[i]]
            else if (cmp == 0) winners.push(players[i])
        }

        this.distPotToWinners(winners)
        
        if (this.status === GameHandStatus.PLAYING) {
            this.status = GameHandStatus.SHOWING_DOWN
        }

        setTimeout(() => {
            this.closeHand()
        }, 5000)
    }

    closeHand() {
        this.status = GameHandStatus.OVER
        setTimeout(() => this.game.startNewHand(), 500)
    }

    distPotToWinners(winners: HandPlayer[]) {
        if (winners.length <= 0) return // TODO: Log error here, noway to have no winner
        console.log(`Winner`, winners.map(p => ({
            id: p.player.id,
            cards: p.cards.map(c => c.desc)
        })))

        // TODO: All in case
        const winPot = this.pot / winners.length
        const remain = winPot % winners.length

        console.log(`Total win pot`, this.pot)

        winners.forEach((w, i) => {
            w.player.stack += winPot + (i < remain ? 1 : 0)
            console.log(`Winner`, w.player.id, `take`, winPot + (i < remain ? 1 : 0), 'from pot')
        })
    }

    checkTerminatedHand(): boolean {
        const playingPlayers = this.players.filter(p => p.status === HandPlayerStatus.PLAYING)
        if (playingPlayers.length > 1) return false
        
        const alledInPlayers = this.players.filter(p => p.status === HandPlayerStatus.ALL_IN)
        if (alledInPlayers.length > 1 && playingPlayers.length === 0) {
            this.autoPlayHandForAllIn()
            return true
        }

        if (alledInPlayers.length + playingPlayers.length === 1) {
            this.commitPot()
            const winners = [...playingPlayers, ...alledInPlayers]
            this.distPotToWinners(winners)
            this.closeHand()
            return true
        }

        return false
    }

    async autoPlayHandForAllIn() {
        this.status = GameHandStatus.AUTO
        this.players.forEach(p => p.showCard = p.showCard || p.status === HandPlayerStatus.ALL_IN)
        while (this.round !== HandRound.DONE) {
            try {
                await hera.sleep(300)
                this.completeRound()
            }
            catch (err) {
                // TODO: Log error, auto play should not have any errors
                console.log(err)
            }
        }
    }

    takeAction(player: GamePlayer, action: IPlayerAction) {
        const game = this.game
        if (game.status !== GameStatus.PLAYING) throw new AppLogicError(`Cannot take action! Game is not playing`)
        if (this.status !== GameHandStatus.PLAYING) throw new AppLogicError(`Hand is not playing`)
        if (!this.roundPlayers.length || this.players[this.roundPlayers[0]].player.id !== player.id) throw new Error(`Not current player`)

        if (action.action === ActionType.TIME) {
            // TODO: add extra time
        }
        else if (action.action === ActionType.FOLD) {
            const hp = this.players.find(p => p.player.id === player.id)
            hp.status = HandPlayerStatus.FOLDED
        }
        else if (action.action === ActionType.BET) {
            if (_.isNil(action.amount)) throw new AppLogicError(`Must have bet amount`)
            const hp = this.players.find(p => p.player.id === player.id)
            this.bet(hp, action.amount)
        }

        if (!this.checkTerminatedHand()) {
            this.moveNext()
        }
    }

    toJSON(player?: GamePlayer) {
        return {
            id: this.id,
            players: this.players.map(p => p.toJSON(player)),
            status: this.status,
            round: this.round,
            communityCards: this.communityCards,
            roundPlayers: this.roundPlayers.map(i => this.players[i].player.id),
            pot: this.pot,
            fullPot: this.fullPot,
        }
    }

    static nextRound(round: HandRound) {
        switch (round) {
            case HandRound.PRE_FLOP:
                return HandRound.FLOP
            case HandRound.FLOP:
                return HandRound.TURN
            case HandRound.TURN:
                return HandRound.RIVER
        }

        return HandRound.DONE
    }
}
