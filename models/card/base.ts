import _ from "lodash";

export enum CardType {
    CARD52,
    EK
}

export abstract class Card {
    abstract get type(): CardType
    abstract get desc(): string
}