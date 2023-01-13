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
    stack: number
    betting = null
    showCard = false

    constructor(p: GamePlayer, seatIndex: number) {
        this.player = p
        this.stack = p.stack
        this.seatIndex = seatIndex
    }

    toJSON(player?: GamePlayer) {
        return {
            player: this.player.toJSON(),
            seatIndex: this.seatIndex,
            status: this.status,
            betting: this.betting,
            stack: this.stack,
            result: this.result,
            showCard: this.showCard,
            cards: this.cardJSON(player)
        }
    }

    cardJSON(player?: GamePlayer) {
        if (!this.cards.length || this.showCard || player?.id === this.player.id) {
            return this.cards
        }

        return [MASKED_CARD, MASKED_CARD]
    }
}


export enum ActionType {
    BET = 'BET',
    FOLD = 'FOLD',
    TIME = 'TIME',
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

export interface GameHandWinner {
    id: string
    amount: number
}

export class GameHand {
    id: string
    deck: Deck = new Deck()
    players: HandPlayer[]
    roundPlayers: number[]
    status: GameHandStatus = GameHandStatus.READY
    round: HandRound = HandRound.PRE_FLOP
    communityCards: Card[] = []
    winners: GameHandWinner[]
    beginActionTime: number = null
    timeOutAt: number = null
    pot = 0
    betting = 0
    minRaise = 0
    isDirty = true

    constructor(public game: Game) {
        this.id = `${game.id}:${shortid.generate()}`
    } 

    get fullPot() {
        return this.pot + _.sumBy(this.players, p => p.betting)
    }

    markDirty(dirty = true) {
        this.isDirty = dirty
    }

    setupAutoActionTimes(timeOut = 15000) {
        this.beginActionTime = Date.now()
        this.timeOutAt = this.beginActionTime + timeOut // 10 secs timeout
    }

    clearAutoActionTimes() {
        this.beginActionTime = null
        this.timeOutAt = null
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
            this.setupAutoActionTimes()
        }

        this.markDirty()
    }

    deal() {
        if (this.status !== GameHandStatus.READY) throw new Error(`Cannot deal, invalid status`)
        // check the players is not dealt
        
        this.deck.shuffle()
        this.players.forEach(p => {
            p.cards = [this.deck.deal(), this.deck.deal()]
        })

        this.markDirty()
    }

    bet(player: HandPlayer, amount: number) {
        if (this.status !== GameHandStatus.PLAYING) throw new Error(`The hand is not playing`)
        if (this.round === HandRound.DONE) throw new Error(`The hand is over`)
        if (player.status !== HandPlayerStatus.PLAYING) throw new Error(`The player is not playing`)
        
        const index = this.roundPlayers[0]
        if (!this.roundPlayers.length || this.players[index] !== player) throw new Error(`Invalid betting player`)

        const maxOtherBet = _.maxBy(this.players, p => (p === player || p.status !== HandPlayerStatus.PLAYING ? 0 : p.stack)).stack
        const maxBet = Math.min(player.stack, maxOtherBet)
        if (amount >= maxBet) { // all in
            amount = maxBet
            player.status = HandPlayerStatus.ALL_IN
        }
        else if (amount > this.betting) { // raise
            if (amount - this.betting < this.minRaise) throw Error(`Invalid betting amount, to low raise, at least ${this.betting + this.minRaise}`)
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

        player.betting = Math.min(amount, player.stack)
        this.markDirty()
    }

    moveNext() {
        if (this.status !== GameHandStatus.PLAYING && this.status !== GameHandStatus.AUTO) throw new Error(`The hand is not playing`)
        if (this.round === HandRound.DONE) throw new Error(`The hand is over`)
        if (!this.roundPlayers.length) throw new Error(`Invalid hand state. No current player??`)

        this.roundPlayers.shift() // TODO: performance
        this.setupAutoActionTimes()
        if (this.roundPlayers.length <= 0) {
            this.completeRound()
        }
        this.markDirty()
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
        this.setupAutoActionTimes()
        this.markDirty()
    }

    commitPot() {
        this.players.forEach(p => {
            const betAmount = Math.min(p.stack, p.betting)
            p.stack -= betAmount
            this.pot += betAmount
            p.betting = null
        })
        this.markDirty()
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
        this.markDirty()
    }

    completeHand() {
        if (this.round !== HandRound.DONE) throw new Error(`The hand is not done yet`)
        if (this.status !== GameHandStatus.PLAYING && this.status !== GameHandStatus.AUTO) throw new Error(`The hand is not playing`)
        
        const players = this.players.filter(p => p.status !== HandPlayerStatus.FOLDED)
        players.forEach(p => p.result = PokerHand.calcHand(p.cards, this.communityCards))

        let winners = [players[0]]
        for (let i = 1; i < players.length; ++i) {
            const cmp = PokerHand.compare(players[i].result, winners[0].result)
            if (cmp > 0) winners = [players[i]]
            else if (cmp == 0) winners.push(players[i])
        }

        this.distPotToWinners(winners)
        this.moveToShowDown()
    }

    moveToShowDown() {
        if (this.status === GameHandStatus.PLAYING || this.status === GameHandStatus.AUTO) {
            this.status = GameHandStatus.SHOWING_DOWN
        }

        this.clearAutoActionTimes()
        setTimeout(() => {
            try {
                this.closeHand()
            }
            catch (err) {
                console.log(`Cannot close hand; Got error`)
                console.log(err)
            }
        }, 5000)
        
        this.markDirty()
    }

    closeHand() {
        this.status = GameHandStatus.OVER
        this.clearAutoActionTimes()
        this.game.handOver()
        this.markDirty()
    }

    distPotToWinners(winners: HandPlayer[], autoShowCard = true): GameHandWinner[] {
        if (winners.length <= 0) return // TODO: Log error here, noway to have no winner

        // TODO: All in case
        const winPot = this.pot / winners.length
        const remain = winPot % winners.length

        this.winners = winners.map((w, i) => {
            const amount = winPot + (i < remain ? 1 : 0)
            w.stack += amount
            if (autoShowCard) {
                w.showCard = true
            }
            return {
                id: w.player.id,
                amount
            }
        })
        this.markDirty()
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
            this.distPotToWinners(winners, false)
            this.moveToShowDown()
            return true
        }

        return false
    }

    async autoPlayHandForAllIn() {
        this.status = GameHandStatus.AUTO
        this.players.forEach(p => p.showCard = p.showCard || p.status === HandPlayerStatus.ALL_IN)
        while (this.round !== HandRound.DONE) {
            try {
                await hera.sleep(1000)
                this.completeRound()
                this.markDirty()
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
        const hp = this.players.find(p => p.player.id === player.id)
        if (!hp || hp.status !== HandPlayerStatus.PLAYING) throw new AppLogicError(`Cannot take action! Player is not playing`)

        if (action.action === ActionType.BET) {
            if (_.isNil(action.amount)) throw new AppLogicError(`Must have bet amount`)
            this.bet(hp, action.amount)
            this.clearAutoActionTimes()
        }
        else if (action.action === ActionType.FOLD) {
            hp.status = HandPlayerStatus.FOLDED
            this.clearAutoActionTimes()
        }
        else if (action.action === ActionType.TIME) {
            // TODO: add extra time
        }

        if (!this.checkTerminatedHand()) {
            setTimeout(() => {
                try {
                    this.moveNext()
                }
                catch (err) {
                    console.log(`Cannot close hand; Got error`)
                    console.log(err)
                }
            }, 500)
        }

        this.markDirty()
    }

    updateHandForAutoAction(time: number) {
        if (this.timeOutAt <= 0 || time < this.timeOutAt) return

        this.clearAutoActionTimes()
        if (this.game.status !== GameStatus.PLAYING || this.status !== GameHandStatus.PLAYING || this.round === HandRound.DONE) return
        const playerIndex = _.first(this.roundPlayers)
        if (_.isNil(playerIndex) || playerIndex < 0 || playerIndex >= this.players.length) return
        const player = this.players[playerIndex]
        if (!player) return

        if (player.betting >= this.betting) { // checkable
            this.takeAction(player.player, {
                action: ActionType.BET,
                amount: player.betting ?? 0
            })
        }
        else {
            this.takeAction(player.player, {
                action: ActionType.FOLD
            })
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
            betting: this.betting,
            minRaise: this.minRaise,
            beginActionTime: this.beginActionTime,
            currentTime: Date.now(),
            timeOutAt: this.timeOutAt,
            winners: this.winners,
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
