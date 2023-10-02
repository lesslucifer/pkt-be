import sha256 from 'crypto-js/sha256'
import { shuffle, MersenneTwister19937 } from 'random-js'
import { Card } from './card/base'

export class Deck<C extends Card = Card> {
    cards: C[] = []
    dealtIndex = 0

    constructor(baseCards: C[]) {
        this.cards = [...baseCards]
    }

    shuffle(...seeds: string[]) {
        const nonce = seeds.join('')
        const hash = sha256(nonce);
        const randomizer = MersenneTwister19937.seedWithArray(hash.words)
        this.cards = shuffle(randomizer, this.cards)
    }

    deal(): C {
        if (this.dealtIndex >= this.cards.length) throw new Error(`Deck overflow`)
        const card = this.cards[this.dealtIndex++]
        return card
    }
}