import _ from "lodash";
import { Card, Deck } from "./card";
import { GamePlayer } from "./game";

export enum HandPlayerStatus {
    ACTIVE = 'ACTIVE',
    FOLDED = 'FOLDED',
    ALL_IN = 'ALL_IN'
}

export enum HandRound {
    BLIND = 'BLIND',
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
}

export enum GameHandStatus {
    READY = 'READY',
    PLAYING = 'PLAYING',
    SHOWING_DOWN = 'SHOWING_DOWN',
    OVER = 'OVER',
}

export class GameHand {
    deck: Deck = new Deck()
    players: HandPlayer[]
    status: GameHandStatus
    round: HandRound = HandRound.BLIND
    communityCards: Card[] = []
    index = 0
    pot = 0

    get fullPot() {
        return this.pot + _.sumBy(this.players, p => p.betting)
    }

    start() {
        this.deal()
        this.bet(this.players[0], 10)
        this.bet(this.players[1], 20)

        this.round = HandRound.PRE_FLOP
    }

    deal() {
        // check the status
        // check the players is not dealt
        
        this.deck.shuffle()
        this.players.forEach(p => {
            p.cards = [this.deck.deal(), this.deck.deal()]
        })
    }

    bet(player: HandPlayer, amount: number) {
        if (this.players[this.index] !== player) throw new Error(`Invalid betting player`)

        player.betting = Math.min(amount, player.player.bank)
        player.player.bank -= player.betting
        if (player.player.bank <= 0) {
            player.status = HandPlayerStatus.ALL_IN
        }
    }

    moveNext() {
        this.index += 1
        if (this.round === HandRound.PRE_FLOP) {
            if (this.index >= this.players.length) {
                this.index = 0
            }
            else if (this.index === 2) { // big blind 
                this.completeRound()
                return
            }
        }
        else if (this.index >= this.players.length) {
            this.completeRound()
            return
        }
    }

    completeRound() {
        this.pot += _.sumBy(this.players, p => p.betting)
        this.players.forEach(p => p.betting = 0)

        this.index = 0
        this.round = GameHand.nextRound(this.round)
        if (this.round === HandRound.DONE) {
            this.completeHand()
            return
        }

        this.dealNextHand()
    }

    dealNextHand() {
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
        // calc result
        // share pot
        // showdown
    }

    static nextRound(round: HandRound) {
        switch (round) {
            case HandRound.BLIND:
                return HandRound.PRE_FLOP
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
