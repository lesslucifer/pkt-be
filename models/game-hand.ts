import _ from "lodash";
import shortid from "shortid";
import hera from "../utils/hera";
import { Card, Deck } from "./card";
import { Game, GamePlayer } from "./game";
import { PokerHand } from "./poker-hand";

export enum HandPlayerStatus {
    ACTIVE = 'ACTIVE',
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
    status: HandPlayerStatus = HandPlayerStatus.ACTIVE
    betting = 0

    constructor(p: GamePlayer, seatIndex: number) {
        this.player = p
        this.seatIndex = seatIndex
    }

    toJSON() {
        return {
            player: this.player.toJSON(),
            seatIndex: this.seatIndex,
            status: this.status,
            betting: this.betting
        }
    }
}

export enum GameHandStatus {
    READY = 'READY',
    PLAYING = 'PLAYING',
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

        this.roundPlayers = hera.rotate(_.range(this.players.length), 2)
        this.round = HandRound.PRE_FLOP
        this.betting = 20
        this.minRaise = 20
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
        if (this.round === HandRound.DONE) throw new Error(`The hand is over`)
        const index = this.roundPlayers[0]
        if (!this.roundPlayers.length || this.players[index] !== player) throw new Error(`Invalid betting player`)

        // validate bet amount
        this.validateBetAmount(player, amount)
        if (amount > this.betting) {
            const nextPlayers = _.range(this.players.length)
            .map(i => (i + index) % this.players.length)
            .filter(i => !this.roundPlayers.includes(i) && this.players[i].status === HandPlayerStatus.ACTIVE)
            this.roundPlayers.push(...nextPlayers)
        }

        this.minRaise = Math.max(this.minRaise, amount - this.betting)
        this.betting = Math.max(this.betting, amount)

        player.betting = Math.min(amount, player.player.bank)
        player.player.bank -= player.betting
        if (player.player.bank <= 0) {
            player.status = HandPlayerStatus.ALL_IN
        }
    }

    validateBetAmount(player: HandPlayer, amount: number) {
        if (amount >= player.player.bank) return 'ALL_IN'
        if (amount === this.betting) return 'CALL'
        if (amount > this.betting) {
            if (amount - this.betting < this.minRaise) throw Error(`Invalid betting amount, to low raise, at least ${this.minRaise}`)
            if (this.players.find(p => p.status === HandPlayerStatus.ALL_IN)) throw Error(`Cannot raise, there was a player alled in`)
            return 'RAISE'
        }
        throw Error(`Invalid betting amount, to low bet. Current betting is ${this.betting}`)
    }

    moveNext() {
        if (this.round === HandRound.DONE) throw new Error(`The hand is over`)
        if (!this.roundPlayers.length) throw new Error(`Invalid hand state. No current player??`)

        this.roundPlayers.shift() // TODO
        if (this.roundPlayers.length <= 0) {
            this.completeRound()
        }
    }

    completeRound() {
        if (this.round === HandRound.DONE) throw new Error(`The hand is over`)

        console.log(`Betting`, this.players.map(p => ({
            id: p.player.id,
            betting: p.betting
        })))
        console.log(`Pot`, this.pot)
        this.pot += _.sumBy(this.players, p => p.betting)
        console.log(`Pot after`, this.pot)
        this.players.forEach(p => p.betting = 0)

        this.round = GameHand.nextRound(this.round)
        this.betting = 0
        this.minRaise = 20
        this.roundPlayers = _.range(this.players.length).filter(i => this.players[i].status === HandPlayerStatus.ACTIVE)
        if (this.round === HandRound.DONE) {
            this.completeHand()
            return
        }

        this.dealNextRound()
    }

    dealNextRound() {
        if (this.round === HandRound.DONE) throw new Error(`The hand is over`)

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
        if (this.status !== GameHandStatus.PLAYING) throw new Error(`The hand is playing`)
        
        const players = this.players.filter(p => p.status !== HandPlayerStatus.FOLDED)
        const hands = players.map(p => ({
            player: p,
            hand: PokerHand.calcHand(p.cards, this.communityCards)
        }))

        console.log(`Complete hand`)
        console.log(`Comunity cards`, this.communityCards.map(c => c.desc))
        console.log(`Players`, this.players.map(p => ({
            id: p.player.id,
            cards: p.cards.map(c => c.desc),
            result: JSON.stringify(hands.find(h => h.player === p)?.hand, null, 2)
        })))

        let winners = [hands[0]]
        for (let i = 1; i < hands.length; ++i) {
            const cmp = PokerHand.compare(hands[i].hand, winners[0].hand)
            if (cmp > 0) winners = [hands[i]]
            else if (cmp == 0) winners.push(hands[i])
        }

        console.log(`Winner`, winners.map(p => ({
            id: p.player.player.id,
            cards: p.player.cards.map(c => c.desc)
        })))

        // TODO: All in case
        const winPot = this.pot / winners.length
        const remain = winPot % winners.length

        console.log(`Total win pot`, this.pot)

        winners.forEach((w, i) => {
            w.player.player.bank += winPot + (i < remain ? 1 : 0)
            console.log(`Winner`, w.player.player.id, `take`, winPot + (i < remain ? 1 : 0), 'from pot')
        })
        
        this.status = GameHandStatus.SHOWING_DOWN
        setTimeout(() => {
            this.status = GameHandStatus.OVER
        }, 5000)
    }

    toJSON() {
        return {
            id: this.id,
            players: this.players,
            status: this.status,
            round: this.round,
            communityCards: this.communityCards,
            roundPlayers: this.roundPlayers.map(i => this.players[i].player.id),
            pot: this.pot
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
