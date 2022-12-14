import _ from "lodash";

export enum CardSuit {
    HEART = 'H',
    DIAMOND = 'D',
    CLUB = 'C',
    SPADE = 'S'
}

// rank: 2 - 14, ace = 14
export class Card {
    public readonly desc: string
    constructor(public readonly rank: number, public readonly suit: CardSuit) {
        this.desc = `${this.rank}:${this.suit}`
    }
}

export const BASE_CARDS: Card[] = _.chain(_.range(2, 15)).flatMap(r => _.values(CardSuit).map(s => new Card(r, s))).value()

export class Deck {
    cards: Card[] = [...BASE_CARDS]
    dealtIndex = 0

    shuffle() {
        // no shuffle
    }

    deal(): Card {
        if (this.dealtIndex >= this.cards.length) throw new Error(`Deck overflow`)
        return this.cards[this.dealtIndex++]
    }
}