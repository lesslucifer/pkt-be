import _ from "lodash";

export enum CardSuit {
    HEART = 'H',
    DIAMOND = 'D',
    CLUB = 'C',
    SPADE = 'S'
}

// rank: 2 - 14, ace = 14
export interface Card {
    rank: number
    suit: CardSuit
}

export const BASE_CARDS: Card[] = _.chain(_.range(2, 15)).flatMap(r => _.values(CardSuit).map(s => ({rank: r, suit: s}))).value()
export const MASKED_CARD: Card = {rank: 0, suit: CardSuit.HEART}

export function getCardDesc(card: Card) {
    return `${card.rank}:${card.suit}`
}

export class Deck {
    cards: Card[] = [...BASE_CARDS]
    dealtCards: Card[] = []
    dealtIndex = 0

    shuffle() {
        // TODO: shuffle
        this.cards = _.shuffle(this.cards)
    }

    deal(): Card {
        if (this.dealtIndex >= this.cards.length) throw new Error(`Deck overflow`)
        const card = this.cards[this.dealtIndex++]
        this.dealtCards.push(card)
        return card
    }
}