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
        const rankDesc = rank <= 10 ? `${rank}` : {
            11: 'J',
            12: 'Q',
            13: 'K',
            14: 'A'
        }[rank]
        this.desc = `${rankDesc}:${this.suit}`
    }
}

export const BASE_CARDS: Card[] = _.chain(_.range(2, 15)).flatMap(r => _.values(CardSuit).map(s => new Card(r, s))).value()
export const MASKED_CARD: Card = new Card(0, CardSuit.HEART)

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