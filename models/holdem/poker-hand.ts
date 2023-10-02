import _ from "lodash";
import { Card52, CardSuit } from "../card/card52";

export enum PokerHandRank {
    HIGH_CARD = 0,
    ONE_PAIR = 1,
    TWO_PAIR = 2,
    THREE_OF_A_KIND = 3,
    STRAIGHT = 4,
    FLUSH = 5,
    FULLHOUSE = 6,
    FOUR_OF_A_KIND = 7,
    STRAIGHT_FLUSH = 8,
    ROYAL_FLUSH = 9,
}

export interface PokerHandRankResult {
    rank: PokerHandRank
    values: number[] // values store the value of the hand depends on rank
    suit?: CardSuit // some rank needs suit
}

export interface PokerHandCalcResult extends PokerHandRankResult {
    selectedCard: Card52[]
    holeCardIndexes: number[]
    communityCardsIndexes: number[]
}

export interface PokerHandResult {
    rank: PokerHandRank
    holeCardIndexes: number[]
    values: number[] // values store the value of the hand depends on rank
    communityCardsIndexes: number[]
}

export class PokerHand {
    static calcHand(holeCards: Card52[], communityCards: Card52[]): PokerHandResult {
        if (holeCards.length !== 2 || communityCards.length !== 5) throw new Error(`Invalid numer of cards`)
        const cards = [...holeCards, ...communityCards]
        const rankCheckers = [this.checkStraightFlush, this.checkFourOfAKind, this.checkFullHouse,
            this.checkFlush, this.checkStraight, this.checkThreeOfAKind, this.checkTwoPairs,
            this.checkOnePair, this.highCards]

        let rankResult: PokerHandRankResult
        for (const checker of rankCheckers) {
            rankResult = checker(cards)
            if (rankResult) break
        }

        const result: PokerHandCalcResult = {
            ...rankResult,
            selectedCard: this.getSelectedCard(cards, rankResult),
            holeCardIndexes: [],
            communityCardsIndexes: [],
        }

        const selCardDescs = new Set(result.selectedCard.map(c => c.desc))
        result.holeCardIndexes = _.range(holeCards.length).filter(i => selCardDescs.has(holeCards[i].desc))
        result.communityCardsIndexes = _.range(communityCards.length).filter(i => selCardDescs.has(communityCards[i].desc))
        
        if (result.rank === PokerHandRank.STRAIGHT_FLUSH && result.values[0] === 14) {
            result.rank = PokerHandRank.ROYAL_FLUSH
        }

        return {
            rank: result.rank,
            values: result.values,
            communityCardsIndexes: result.communityCardsIndexes,
            holeCardIndexes: result.holeCardIndexes,
        }
    }

    static getSelectedCard(cards: Card52[], result: PokerHandRankResult): Card52[] {
        if (result.rank === PokerHandRank.STRAIGHT_FLUSH) {
            return cards.filter((c: Card52) => c.suit === result.suit && ((result.values[0] - 4 <= c.rank && c.rank <= result.values[0]) || (result.values[0] === 5 && c.rank === 14)))
        }
        else if (result.rank === PokerHandRank.FOUR_OF_A_KIND) {
            return [...cards.filter(c => c.rank === result.values[0]), cards.find(c => c.rank === result.values[1])]
        }
        else if (result.rank === PokerHandRank.FULLHOUSE) {
            return [...cards.filter(c => c.rank === result.values[0]), ...cards.filter(c => c.rank === result.values[1]).slice(0, 2)]
        }
        else if (result.rank === PokerHandRank.FLUSH) {
            return _.sortBy(cards.filter(c => c.suit === result.suit), c => -c.rank).slice(0, 5)
        }
        else if (result.rank === PokerHandRank.STRAIGHT) {
            return _.uniqBy(cards.filter(c => (result.values[0] - 4 <= c.rank && c.rank <= result.values[0]) || (result.values[0] === 5 && c.rank === 14)), c => c.rank)
        }
        else if (result.rank === PokerHandRank.THREE_OF_A_KIND) {
            return cards.filter(c => result.values.includes(c.rank))
        }
        else if (result.rank === PokerHandRank.TWO_PAIR) {
            return [...cards.filter(c => c.rank === result.values[0] || c.rank == result.values[1]), cards.find(c => c.rank === result.values[2])]
        }
        
        return cards.filter(c => result.values.includes(c.rank))
    }

    static checkStraightFlush(cards: Card52[]): PokerHandRankResult {
        const cardSet = new Set(cards.map(c => c.desc))
        cards.forEach(c => {
            if (c.rank === 14) {
                cardSet.add(`1:${c.suit}`) // for bottom straight
            }
        })

        for (const s of _.values(CardSuit)) {
            for (const r of _.range(14, 4, -1)) {
                if (cardSet.has(`${r}:${s}`) &&
                cardSet.has(`${r - 1}:${s}`) &&
                cardSet.has(`${r - 2}:${s}`) &&
                cardSet.has(`${r - 3}:${s}`) &&
                cardSet.has(`${r - 4}:${s}`)) return {
                    rank: PokerHandRank.STRAIGHT_FLUSH,
                    values: [r],
                    suit: s
                }
            }
        }
    }

    static checkFourOfAKind(cards: Card52[]): PokerHandRankResult {
        const count = _.countBy(cards, c => c.rank)
        const quadRank = Number(_.keys(count).find(r => count[r] === 4))
        if (!_.isNaN(quadRank)) return {
            rank: PokerHandRank.FOUR_OF_A_KIND,
            values: [quadRank, _.maxBy(cards, c => c.rank === quadRank ? 0 : c.rank).rank]
        }
    }

    static checkFullHouse(cards: Card52[]): PokerHandRankResult {
        const count = _.countBy(cards, c => c.rank)
        let tripRank = 0, pairRank = 0
        for (const [r, c] of _.entries(count)) {
            const rank = Number(r)
            if (c === 3 && rank > tripRank) tripRank = rank
        }

        for (const [r, c] of _.entries(count)) {
            const rank = Number(r)
            if (c >= 2 && rank !== tripRank && rank > pairRank) pairRank = rank
        }
        
        if (tripRank > 0 && pairRank > 0) return {
            rank: PokerHandRank.FULLHOUSE,
            values: [tripRank, pairRank]
        }
    }

    static checkFlush(cards: Card52[]): PokerHandRankResult {
        const count = _.countBy(cards, c => c.suit)
        const s = _.keys(count).find(s => count[s] >= 5)
        if (s) return {
            rank: PokerHandRank.FLUSH,
            values: _.sortBy(cards.filter(c => c.suit === s).map(c => c.rank), r => -r).slice(0, 5),
            suit: <CardSuit> s
        }
    }

    static checkStraight(cards: Card52[]): PokerHandRankResult {
        const rankSet = new Set(cards.map(c => c.rank))
        if (rankSet.has(14)) rankSet.add(1)

        for (const r of _.range(14, 4, -1)) {
            if (rankSet.has(r) &&
            rankSet.has(r - 1) &&
            rankSet.has(r - 2) &&
            rankSet.has(r - 3) &&
            rankSet.has(r - 4)) return {
                rank: PokerHandRank.STRAIGHT,
                values: [r]
            }
        }
    }

    static checkThreeOfAKind(cards: Card52[]): PokerHandRankResult {
        const count = _.countBy(cards, c => c.rank)
        const tripRank = Number(_.keys(count).find(r => count[r] === 3))
        if (!_.isNaN(tripRank)) return {
            rank: PokerHandRank.THREE_OF_A_KIND,
            values: [tripRank, ..._.chain(cards).map(c => c.rank === tripRank ? 0 : c.rank).sortBy(r => -r).slice(0, 2).value()]
        }
    }

    static checkTwoPairs(cards: Card52[]): PokerHandRankResult {
        const count = _.countBy(cards, c => c.rank)
        const pairs = _.entries(count).filter(([r, c]) => c === 2).map(([r]) => Number(r))
        if (pairs.length >= 2) {
            const twoPairs = _.sortBy(pairs, r => -r).slice(0, 2)
            const kicker = _.maxBy(cards, c => twoPairs.includes(c.rank) ? 0 : c.rank).rank
            return {
                rank: PokerHandRank.TWO_PAIR,
                values: [...twoPairs, kicker]
            }
        }
    }

    static checkOnePair(cards: Card52[]): PokerHandRankResult {
        const count = _.countBy(cards, c => c.rank)
        const pair = Number(_.keys(count).find(r => count[r] === 2))
        if (!_.isNaN(pair)) {
            return {
                rank: PokerHandRank.ONE_PAIR,
                values: [pair, ..._.chain(cards).map(c => c.rank === pair ? 0 : c.rank).sortBy(r => -r).slice(0, 3).value()]
            }
        }
    }

    static highCards(cards: Card52[]): PokerHandRankResult {
        return {
            rank: PokerHandRank.HIGH_CARD,
            values: _.chain(cards).map(c => c.rank).sortBy(r => -r).slice(0, 5).value()
        }
    }

    static compare(h1: PokerHandResult, h2: PokerHandResult) {
        if (_.isNil(h1) || _.isNil(h2)) return !_.isNil(h1) ? 1 : !_.isNil(h2) ? -1 : 0
        if (h1.rank > h2.rank) return 1
        if (h1.rank < h2.rank) return -1

        for (let i = 0; i < h1.values.length; ++i) {
            if (h1.values[i] > h2.values[i]) return 1
            if (h1.values[i] < h2.values[i]) return -1
        }

        return 0
    }
}