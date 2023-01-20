import _ from "lodash";
import shortid from "shortid";
import hera, { AppLogicError } from "../utils/hera";
import { Card, Deck } from "./card";
import { Game, GamePlayer, GameStatus } from "./game";
import { PokerHand, PokerHandResult } from "./poker-hand";

export enum HandStepType {
    NEW_GAME = 0,
    NEW_ROUND,
    BET,
    FOLD,
    SHOW_DOWN,
    SHOW_CARDS
}

export interface IHandStep {
    type: HandStepType
    player?: string
    amount?: number
    round?: HandRound
    cards?: Card[]
}

export enum HandPlayerStatus {
    PLAYING = 'P',
    FOLDED = 'F',
    ALL_IN = 'A'
}

export enum HandRound {
    PRE_FLOP = 'PF',
    FLOP = 'F',
    TURN = 'T',
    RIVER = 'R',
    DONE = 'D',
}

export class HandPlayer {
    id: string
    seatIndex: number
    status: HandPlayerStatus = HandPlayerStatus.PLAYING
    result?: PokerHandResult
    stack: number
    betting = null
    showCard = false

    constructor(p: GamePlayer, seatIndex: number) {
        this.id = p.id
        this.stack = p.stack
        this.seatIndex = seatIndex
    }

    toJSON() {
        return {
            id: this.id,
            status: this.status,
            betting: this.betting,
            stack: this.stack,
            result: this.result,
            showCard: this.showCard
        }
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
    READY = 'R',
    TRANSITION = 'T',
    PLAYING = 'P',
    AUTO = 'A',
    SHOWING_DOWN = 'SD',
    OVER = 'O',
}

export interface GameHandWinner {
    id: string
    amount: number
}

export class GameHand {
    id: number
    dealerSeat: number
    seats: string[]

    deck: Deck = new Deck()
    publicSeed: string
    privateSeed: string
    shuffleTime: number

    playersMap: Map<string, HandPlayer> = new Map()
    playerCards: _.Dictionary<Card[]> = {}

    roundPlayers: number[] = []
    status: GameHandStatus = GameHandStatus.READY
    round: HandRound = HandRound.PRE_FLOP
    communityCards: Card[] = []
    winners: _.Dictionary<number> = {}
    beginActionTime: number = null
    timeOutAt: number = null
    committedPot: number = 0
    pot: _.Dictionary<number> = {}
    betting = 0
    minRaise = 0
    
    private dirty = true
    steps: IHandStep[] = []
    logs: {
        data: ArrayBuffer
        steps: IHandStep[]
    }[] = []

    get isDirty() {
        return this.dirty
    }

    constructor(private game: Game, private players: HandPlayer[]) {
        this.id = game.nextHandId()
        this.dealerSeat = game.dealerSeat
        this.seats = [...game.seats]
        this.publicSeed = game.seed
        this.privateSeed = shortid.generate()
        players.forEach(p => this.playersMap.set(p.id, p))
    } 

    get fullPot() {
        return this.committedPot + _.sumBy(this.players, p => p.betting)
    }

    markDirty(...steps: IHandStep[]) {
        this.dirty = true
        if (steps) {
            this.steps.push(...steps)
        }
    }

    unmarkDirty(data: ArrayBuffer) {
        this.dirty = false
        if (this.steps.length > 0) {
            this.logs.push({
                steps: [...this.steps],
                data
            })
            this.steps.length = 0
        }
    }

    setupAutoActionTimes() {
        this.beginActionTime = Date.now()
        this.timeOutAt = this.beginActionTime + this.game.settings.actionTime
    }

    clearAutoActionTimes() {
        this.beginActionTime = null
        this.timeOutAt = null
    }

    start() {
        this.deal()

        this.status = GameHandStatus.PLAYING

        this.markDirty({
            type: HandStepType.NEW_GAME
        })

        this.roundPlayers = [0]
        this.bet(this.players[0], this.game.settings.smallBlind)
        this.roundPlayers = [1]
        this.bet(this.players[1], this.game.settings.bigBlind)

        if (!this.checkTerminatedHand()) {
            this.roundPlayers = hera.rotate(_.range(this.players.length), 2)
            this.round = HandRound.PRE_FLOP
            this.betting = this.game.settings.bigBlind
            this.minRaise = this.game.settings.bigBlind
            this.setupAutoActionTimes()
        }
    }

    deal() {
        if (this.status !== GameHandStatus.READY) throw new Error(`Cannot deal, invalid status`)
        // check the players is not dealt
        
        this.shuffleTime = Date.now()
        this.deck.shuffle(this.shuffleTime, [this.game.seed, this.privateSeed])
        this.players.forEach(p => {
            this.playerCards[p.id] = [this.deck.deal(), this.deck.deal()]
        })

        this.markDirty()
    }

    bet(player: HandPlayer, amount: number) {
        if (this.status !== GameHandStatus.PLAYING) throw new Error(`The hand is not playing`)
        if (this.round === HandRound.DONE) throw new Error(`The hand is over`)
        if (player.status !== HandPlayerStatus.PLAYING) throw new Error(`The player is not playing`)
        
        const index = this.roundPlayers[0]
        if (!this.roundPlayers.length || this.players[index] !== player) throw new Error(`Invalid betting player`)

        const maxOtherBet = _.maxBy(this.players, p => (p === player || p.status === HandPlayerStatus.FOLDED ? 0 : p.stack)).stack
        const maxBet = Math.min(player.stack, maxOtherBet)
        if (amount >= maxBet) { // all in
            amount = maxBet
            player.status = HandPlayerStatus.ALL_IN
        }
        else if (amount > this.betting) { // raise
            if (amount - this.betting < this.minRaise) throw Error(`Invalid betting amount, to low raise, at least ${this.betting + this.minRaise}`)
            // if (this.players.find(p => p.status === HandPlayerStatus.ALL_IN)) throw Error(`Cannot raise, there was a player alled in`)
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

        this.minRaise = Math.max(this.minRaise, amount - this.betting)
        this.betting = Math.max(this.betting, amount)

        player.betting = Math.min(amount, player.stack)
        this.markDirty({
            type: HandStepType.BET,
            player: player.id,
            amount: player.betting
        })
    }

    moveNext() {
        if (this.status !== GameHandStatus.TRANSITION) throw new Error(`The hand is not in transitioning status`)
        if (this.round === HandRound.DONE) throw new Error(`The hand is over`)
        if (!this.roundPlayers.length) throw new Error(`Invalid hand state. No current player??`)

        this.status = GameHandStatus.PLAYING
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
        this.minRaise = this.game.settings.bigBlind
        this.roundPlayers = _.range(this.players.length).filter(i => this.players[i].status === HandPlayerStatus.PLAYING)
        if (this.round === HandRound.DONE) {
            this.completeHand()
            return
        }

        this.dealNextRound()
        this.setupAutoActionTimes()
        this.markDirty({
            type: HandStepType.NEW_ROUND,
            round: this.round,
            cards: this.round === HandRound.FLOP ? this.communityCards : [_.last(this.communityCards)]
        })
    }

    commitPot() {
        this.players.forEach(p => {
            const betAmount = Math.min(p.stack, p.betting)
            p.stack -= betAmount
            this.pot[p.id] = (this.pot[p.id] ?? 0) + betAmount
            this.committedPot += betAmount
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
        players.forEach(p => p.result = PokerHand.calcHand(this.playerCards[p.id], this.communityCards))

        const findWinners = (players: HandPlayer[]) => {
            if (players.length <= 1) return players

            let winners = [players[0]]
            for (let i = 1; i < players.length; ++i) {
                const cmp = PokerHand.compare(players[i].result, winners[0].result)
                if (cmp > 0) winners = [players[i]]
                else if (cmp == 0) winners.push(players[i])
            }
            return winners
        }

        const takePot = (amount) => {
            let taken = 0
            for (const [pid, committed] of _.entries(this.pot)) {
                taken += Math.min(committed, amount)
                this.pot[pid] = Math.max(0, committed - amount)
            }
            return taken
        }

        const distPotToWinners = (pot: number, players: HandPlayer[]) => {
            if (players.length <= 0) return // TODO: Log error here, noway to have no winner

            const winPot = pot / players.length
            const remain = winPot % players.length

            players.forEach((p, i) => this.winners[p.id] = (this.winners[p.id] ?? 0) + winPot + (i < remain ? 1 : 0))
        }

        let remainingPlayers = players
        while (remainingPlayers.length > 0) {
            const winners = findWinners(remainingPlayers)
            const leastCommitted = _.min(winners.map(w => this.pot[w.id]))
            const takenPot = takePot(leastCommitted)
            distPotToWinners(takenPot, winners)

            remainingPlayers = remainingPlayers.filter(p => this.pot[p.id] > 0)
        }

        _.entries(this.winners).forEach(([pid, winAmount]) => {
            if (winAmount <= 0) return
            this.playersMap.get(pid).stack += winAmount
            this.playersMap.get(pid).showCard = true
        })

        // This case shouldn't be existed, just a safe-check. All remaining committed post shouuld return to the player
        _.entries(this.pot).forEach(([pid, amount]) => {
            if (amount > 0) {
                console.log(`Complete hand error, there are pot remained`, pid, amount)
                this.playersMap.get(pid).stack += amount
            }
        })

        this.moveToShowDown()
    }

    moveToShowDown() {
        // transfer to game player stack when entering showdown
        this.players.forEach(hp => this.game.players.get(hp.id).stack = hp.stack)

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
        }, this.game.settings.showDownTime)
        
        this.markDirty({
            type: HandStepType.SHOW_DOWN
        })
    }

    closeHand() {
        this.status = GameHandStatus.OVER
        this.clearAutoActionTimes()
        this.game.handOver()
        this.markDirty()
    }

    checkTerminatedHand(): boolean {
        const playingPlayers = this.players.filter(p => p.status === HandPlayerStatus.PLAYING)
        if (playingPlayers.length > 1) return false
        
        const alledInPlayers = this.players.filter(p => p.status === HandPlayerStatus.ALL_IN)

        if (alledInPlayers.length + playingPlayers.length === 1) { // all folded, terminate hand
            this.commitPot()
            const winner = _.first(alledInPlayers) ?? _.first(playingPlayers)
            winner.stack += this.committedPot
            _.keys(this.pot).forEach(pid => this.pot[pid] = 0)
            this.winners = {[winner.id]: this.committedPot}
            this.moveToShowDown()
            return true
        }

        const onlyPlayer = _.first(playingPlayers)
        if (alledInPlayers.length >= 1 && playingPlayers.length <= 1 && (!onlyPlayer || ((onlyPlayer.betting ?? 0) >= this.betting))) {
            if (onlyPlayer) {
                onlyPlayer.status = HandPlayerStatus.ALL_IN
                onlyPlayer.betting = Math.min(playingPlayers[0].stack, _.max(alledInPlayers.map(p => p.betting)))
            }
            this.autoPlayHandForAllIn()
            return true
        }

        return false
    }

    async autoPlayHandForAllIn() {
        this.status = GameHandStatus.AUTO
        this.players.forEach(p => p.showCard = p.showCard || p.status === HandPlayerStatus.ALL_IN)
        while (this.round !== HandRound.DONE) {
            try {
                await hera.sleep(this.game.settings.gameSpeed * 4)
                this.completeRound()
                this.markDirty()
            }
            catch (err) {
                // TODO: Log error, auto play should not have any errors
                console.log(err)
            }
        }
    }

    takeAction(playerId: string, action: IPlayerAction) {
        const game = this.game
        if (game.status !== GameStatus.PLAYING) throw new AppLogicError(`Cannot take action! Game is not playing`)
        if (this.status !== GameHandStatus.PLAYING) throw new AppLogicError(`Hand is not playing`)
        if (!this.roundPlayers.length || this.players[this.roundPlayers[0]].id !== playerId) throw new Error(`Not current player`)
        const hp = this.playersMap.get(playerId)
        if (!hp || hp.status !== HandPlayerStatus.PLAYING) throw new AppLogicError(`Cannot take action! Player is not playing`)

        if (action.action === ActionType.BET) {
            if (_.isNil(action.amount)) throw new AppLogicError(`Must have bet amount`)
            this.clearAutoActionTimes()
            this.bet(hp, action.amount)
        }
        else if (action.action === ActionType.FOLD) {
            this.clearAutoActionTimes()
            hp.status = HandPlayerStatus.FOLDED
            this.markDirty({
                type: HandStepType.FOLD,
                player: playerId
            })
        }
        else if (action.action === ActionType.TIME) {
            // TODO: add extra time
        }

        if (!this.checkTerminatedHand()) {
            this.status = GameHandStatus.TRANSITION
            setTimeout(() => {
                try {
                    this.moveNext()
                }
                catch (err) {
                    console.log(`Cannot close hand; Got error`)
                    console.log(err)
                }
            }, this.game.settings.gameSpeed)
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
            this.takeAction(player.id, {
                action: ActionType.BET,
                amount: player.betting ?? 0
            })
        }
        else {
            this.takeAction(player.id, {
                action: ActionType.FOLD
            })
        }
    }

    resume() {
        if (this.timeOutAt > 0) this.setupAutoActionTimes()
    }

    toJSON(includeSteps = false) {
        return {
            id: this.id,
            players: this.players,
            playerCards: this.players.filter(p => p.showCard).map(p => ({id: p.id, cards: this.playerCards[p.id]})),
            status: this.status,
            round: this.round,
            communityCards: this.communityCards,
            currentPlayer: this.roundPlayers.length > 0 ? this.players[this.roundPlayers[0]].id : null,
            committedPot: this.committedPot,
            fullPot: this.fullPot,
            betting: this.betting,
            minRaise: this.minRaise,
            beginActionTime: this.beginActionTime,
            timeOutAt: this.timeOutAt,
            winners: this.winners,
            ...(includeSteps ? {steps: this.steps} : {})
        }
    }

    persistJSON() {
        return {
            gameId: this.game.id,
            id: this.id,
            dealerSeat: this.dealerSeat,
            seats: this.seats,
            publicSeed: this.publicSeed,
            privateSeed: this.privateSeed,
            shuffleTime: this.shuffleTime,
            playerNames: _.fromPairs(this.players.map(p => [p.id, this.game.players.get(p.id).name])),
            yourCards: _.fromPairs(this.players.map(p => [p.id, this.playerCards[p.id]])),
            playerCards: this.players.filter(p => p.showCard).map(p => ({id: p.id, cards: this.playerCards[p.id]})),
            communityCards: this.communityCards,
            winners: this.winners,
            logs: this.logs
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
