import _ from "lodash";
import { Card, CardType } from "./base";

export enum CardSuit {
    HEART = 'H',
    DIAMOND = 'D',
    CLUB = 'C',
    SPADE = 'S'
}

export interface ICard52 {
    rank: number
    suit: CardSuit
}

export class Card52 extends Card implements ICard52 {
    static readonly BASE_CARDS: Card52[] = _.chain(_.range(2, 15)).flatMap(r => _.values(CardSuit).map(s => (new Card52(r, s)))).value()
    static readonly MASKED_CARD: Card52 = new Card52(0, CardSuit.HEART)

    constructor(public rank: number, public suit: CardSuit) {
        super()
    }

    get type() { return CardType.CARD52 }
    get desc(): string {
        return `${this.rank}:${this.suit}`
    }

    static mk(card: ICard52) {
        return new Card52(card.rank, card.suit)
    }
}