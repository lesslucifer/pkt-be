import _ from 'lodash';
import TestUtils from '../utils/testutils';
import { expect } from 'chai';
import sinon from 'sinon';
import { Card, CardSuit } from '../../models/card';
import { PokerHand, PokerHandRank } from '../../models/poker-hand';

describe("# Poker hand calculation tests:", () => {
    const expectRank = (rank: PokerHandRank, examples: Card[][]) => {
        examples.forEach(cards => {
            for (let i = 0; i < 20; ++i) {
                const shuffled = _.shuffle(cards)
                expect(PokerHand.calcHand(shuffled.slice(0, 2), shuffled.slice(2)).rank).eq(rank)
            }
        })
    }

    before(async () => {
    })

    afterEach(async () => {
    });

    describe('Rank check', async () => {
        it('Royal flush', async () => {
            const royalFlushes = [
                [
                    {rank: 14, suit: CardSuit.SPADE},
                    {rank: 13, suit: CardSuit.SPADE},
                    {rank: 12, suit: CardSuit.SPADE},
                    {rank: 11, suit: CardSuit.SPADE},
                    {rank: 10, suit: CardSuit.SPADE},
                    {rank: 8, suit: CardSuit.DIAMOND},
                    {rank: 6, suit: CardSuit.CLUB},
                ],
                [
                    {rank: 14, suit: CardSuit.HEART},
                    {rank: 13, suit: CardSuit.HEART},
                    {rank: 12, suit: CardSuit.HEART},
                    {rank: 11, suit: CardSuit.HEART},
                    {rank: 10, suit: CardSuit.HEART},
                    {rank: 7, suit: CardSuit.DIAMOND},
                    {rank: 5, suit: CardSuit.CLUB},
                ],
                [
                    {rank: 14, suit: CardSuit.SPADE},
                    {rank: 13, suit: CardSuit.SPADE},
                    {rank: 12, suit: CardSuit.SPADE},
                    {rank: 11, suit: CardSuit.SPADE},
                    {rank: 10, suit: CardSuit.SPADE},
                    {rank: 8, suit: CardSuit.DIAMOND},
                    {rank: 6, suit: CardSuit.CLUB},
                ]

            ]

            expectRank(PokerHandRank.ROYAL_FLUSH, royalFlushes)
        });

        it('Straight flush', async () => {
            const straightFlushses = [
                [
                    {rank: 6, suit: CardSuit.SPADE},
                    {rank: 10, suit: CardSuit.SPADE},
                    {rank: 9, suit: CardSuit.SPADE},
                    {rank: 8, suit: CardSuit.SPADE},
                    {rank: 14, suit: CardSuit.HEART},
                    {rank: 7, suit: CardSuit.SPADE},
                    {rank: 11, suit: CardSuit.SPADE},
                ],
                [
                    {rank: 3, suit: CardSuit.DIAMOND},
                    {rank: 7, suit: CardSuit.DIAMOND},
                    {rank: 6, suit: CardSuit.DIAMOND},
                    {rank: 5, suit: CardSuit.DIAMOND},
                    {rank: 13, suit: CardSuit.SPADE},
                    {rank: 4, suit: CardSuit.DIAMOND},
                    {rank: 12, suit: CardSuit.SPADE},
                ],
                [
                    {rank: 3, suit: CardSuit.DIAMOND},
                    {rank: 7, suit: CardSuit.DIAMOND},
                    {rank: 6, suit: CardSuit.DIAMOND},
                    {rank: 5, suit: CardSuit.DIAMOND},
                    {rank: 13, suit: CardSuit.SPADE},
                    {rank: 4, suit: CardSuit.DIAMOND},
                    {rank: 12, suit: CardSuit.SPADE},
                ],
                [
                    {rank: 4, suit: CardSuit.CLUB},
                    {rank: 8, suit: CardSuit.CLUB},
                    {rank: 7, suit: CardSuit.CLUB},
                    {rank: 6, suit: CardSuit.CLUB},
                    {rank: 14, suit: CardSuit.SPADE},
                    {rank: 5, suit: CardSuit.CLUB},
                    {rank: 13, suit: CardSuit.SPADE},
                ],
                [
                    {rank: 14, suit: CardSuit.CLUB},
                    {rank: 2, suit: CardSuit.CLUB},
                    {rank: 3, suit: CardSuit.CLUB},
                    {rank: 4, suit: CardSuit.CLUB},
                    {rank: 5, suit: CardSuit.CLUB},
                    {rank: 8, suit: CardSuit.DIAMOND},
                    {rank: 6, suit: CardSuit.HEART},
                ],
                [
                    {rank: 7, suit: CardSuit.HEART},
                    {rank: 6, suit: CardSuit.HEART},
                    {rank: 5, suit: CardSuit.HEART},
                    {rank: 4, suit: CardSuit.HEART},
                    {rank: 3, suit: CardSuit.HEART},
                    {rank: 2, suit: CardSuit.DIAMOND},
                    {rank: 1, suit: CardSuit.CLUB},
                ],
                [
                    {rank: 7, suit: CardSuit.HEART},
                    {rank: 7, suit: CardSuit.DIAMOND},
                    {rank: 5, suit: CardSuit.HEART},
                    {rank: 4, suit: CardSuit.HEART},
                    {rank: 3, suit: CardSuit.HEART},
                    {rank: 6, suit: CardSuit.HEART},
                    {rank: 2, suit: CardSuit.CLUB},
                ]
            ]

            expectRank(PokerHandRank.STRAIGHT_FLUSH, straightFlushses)
        });

        it('Quads', async () => {
            const quads = [
                [
                    {rank: 7, suit: CardSuit.HEART},
                    {rank: 7, suit: CardSuit.DIAMOND},
                    {rank: 7, suit: CardSuit.CLUB},
                    {rank: 7, suit: CardSuit.SPADE},
                    {rank: 3, suit: CardSuit.HEART},
                    {rank: 2, suit: CardSuit.DIAMOND},
                    {rank: 1, suit: CardSuit.CLUB},
                ],
                [
                    {rank: 14, suit: CardSuit.HEART},
                    {rank: 14, suit: CardSuit.DIAMOND},
                    {rank: 14, suit: CardSuit.CLUB},
                    {rank: 14, suit: CardSuit.SPADE},
                    {rank: 5, suit: CardSuit.HEART},
                    {rank: 2, suit: CardSuit.DIAMOND},
                    {rank: 1, suit: CardSuit.CLUB},
                ]
            ]

            expectRank(PokerHandRank.FOUR_OF_A_KIND, quads)
        });

        it('Fullhouse', async () => {
            const fullHouses = [
                [
                    {rank: 7, suit: CardSuit.HEART},
                    {rank: 7, suit: CardSuit.DIAMOND},
                    {rank: 7, suit: CardSuit.CLUB},
                    {rank: 3, suit: CardSuit.SPADE},
                    {rank: 3, suit: CardSuit.HEART},
                    {rank: 3, suit: CardSuit.DIAMOND},
                    {rank: 2, suit: CardSuit.CLUB},
                ],
                [
                    {rank: 14, suit: CardSuit.HEART},
                    {rank: 14, suit: CardSuit.DIAMOND},
                    {rank: 14, suit: CardSuit.CLUB},
                    {rank: 2, suit: CardSuit.SPADE},
                    {rank: 2, suit: CardSuit.HEART},
                    {rank: 2, suit: CardSuit.DIAMOND},
                    {rank: 3, suit: CardSuit.CLUB},
                ],
                [
                    {rank: 7, suit: CardSuit.HEART},
                    {rank: 7, suit: CardSuit.DIAMOND},
                    {rank: 7, suit: CardSuit.CLUB},
                    {rank: 5, suit: CardSuit.SPADE},
                    {rank: 5, suit: CardSuit.HEART},
                    {rank: 5, suit: CardSuit.DIAMOND},
                    {rank: 3, suit: CardSuit.CLUB},
                ],
                [
                    {rank: 14, suit: CardSuit.HEART},
                    {rank: 14, suit: CardSuit.DIAMOND},
                    {rank: 14, suit: CardSuit.CLUB},
                    {rank: 10, suit: CardSuit.SPADE},
                    {rank: 10, suit: CardSuit.HEART},
                    {rank: 10, suit: CardSuit.DIAMOND},
                    {rank: 2, suit: CardSuit.CLUB},
                ]
            ]

            expectRank(PokerHandRank.FULLHOUSE, fullHouses)
        });

        it('Flush', async () => {
            const flushes = [
                [
                    {rank: 14, suit: CardSuit.DIAMOND},
                    {rank: 13, suit: CardSuit.DIAMOND},
                    {rank: 12, suit: CardSuit.DIAMOND},
                    {rank: 11, suit: CardSuit.DIAMOND},
                    {rank: 9, suit: CardSuit.DIAMOND},
                    {rank: 8, suit: CardSuit.DIAMOND},
                    {rank: 6, suit: CardSuit.CLUB},
                ],
                [
                    {rank: 7, suit: CardSuit.HEART},
                    {rank: 5, suit: CardSuit.HEART},
                    {rank: 3, suit: CardSuit.HEART},
                    {rank: 2, suit: CardSuit.HEART},
                    {rank: 10, suit: CardSuit.HEART},
                    {rank: 8, suit: CardSuit.DIAMOND},
                    {rank: 4, suit: CardSuit.CLUB},
                ],
                [
                    {rank: 7, suit: CardSuit.CLUB},
                    {rank: 5, suit: CardSuit.CLUB},
                    {rank: 3, suit: CardSuit.CLUB},
                    {rank: 2, suit: CardSuit.CLUB},
                    {rank: 10, suit: CardSuit.CLUB},
                    {rank: 8, suit: CardSuit.DIAMOND},
                    {rank: 6, suit: CardSuit.HEART},
                ],
                [
                    {rank: 7, suit: CardSuit.HEART},
                    {rank: 5, suit: CardSuit.HEART},
                    {rank: 4, suit: CardSuit.HEART},
                    {rank: 3, suit: CardSuit.HEART},
                    {rank: 2, suit: CardSuit.HEART},
                    {rank: 8, suit: CardSuit.DIAMOND},
                    {rank: 6, suit: CardSuit.CLUB},
                ],
                [
                    {rank: 7, suit: CardSuit.HEART},
                    {rank: 7, suit: CardSuit.DIAMOND},
                    {rank: 5, suit: CardSuit.HEART},
                    {rank: 4, suit: CardSuit.HEART},
                    {rank: 3, suit: CardSuit.HEART},
                    {rank: 10, suit: CardSuit.HEART},
                    {rank: 2, suit: CardSuit.CLUB},
                ]
                
            ]

            expectRank(PokerHandRank.FLUSH, flushes)
        });

        it('Straight', async () => {
            const straights = [
                [
                    {rank: 7, suit: CardSuit.HEART},
                    {rank: 6, suit: CardSuit.DIAMOND},
                    {rank: 5, suit: CardSuit.CLUB},
                    {rank: 4, suit: CardSuit.SPADE},
                    {rank: 3, suit: CardSuit.HEART},
                    {rank: 8, suit: CardSuit.DIAMOND},
                    {rank: 6, suit: CardSuit.CLUB},
                ],
                [
                    {rank: 14, suit: CardSuit.HEART},
                    {rank: 13, suit: CardSuit.DIAMOND},
                    {rank: 12, suit: CardSuit.CLUB},
                    {rank: 11, suit: CardSuit.SPADE},
                    {rank: 10, suit: CardSuit.HEART},
                    {rank: 8, suit: CardSuit.DIAMOND},
                    {rank: 6, suit: CardSuit.CLUB},
                ],
                [
                    {rank: 7, suit: CardSuit.HEART},
                    {rank: 6, suit: CardSuit.HEART},
                    {rank: 5, suit: CardSuit.HEART},
                    {rank: 4, suit: CardSuit.HEART},
                    {rank: 3, suit: CardSuit.DIAMOND},
                    {rank: 8, suit: CardSuit.DIAMOND},
                    {rank: 6, suit: CardSuit.CLUB},
                ],
                [
                    {rank: 7, suit: CardSuit.HEART},
                    {rank: 7, suit: CardSuit.DIAMOND},
                    {rank: 5, suit: CardSuit.CLUB},
                    {rank: 4, suit: CardSuit.SPADE},
                    {rank: 3, suit: CardSuit.HEART},
                    {rank: 6, suit: CardSuit.DIAMOND},
                    {rank: 2, suit: CardSuit.CLUB},
                ],
                [
                    {rank: 7, suit: CardSuit.HEART},
                    {rank: 7, suit: CardSuit.DIAMOND},
                    {rank: 5, suit: CardSuit.CLUB},
                    {rank: 4, suit: CardSuit.SPADE},
                    {rank: 3, suit: CardSuit.HEART},
                    {rank: 6, suit: CardSuit.DIAMOND},
                    {rank: 2, suit: CardSuit.CLUB},
                ]
            ]

            expectRank(PokerHandRank.STRAIGHT, straights)
        });

        it('Three of a kind', async () => {
            const threeOfAKind = [
                [
                    {rank: 7, suit: CardSuit.HEART},
                    {rank: 7, suit: CardSuit.DIAMOND},
                    {rank: 7, suit: CardSuit.CLUB},
                    {rank: 4, suit: CardSuit.SPADE},
                    {rank: 3, suit: CardSuit.HEART},
                    {rank: 8, suit: CardSuit.DIAMOND},
                    {rank: 6, suit: CardSuit.CLUB},
                ],
                [
                    {rank: 14, suit: CardSuit.HEART},
                    {rank: 14, suit: CardSuit.DIAMOND},
                    {rank: 14, suit: CardSuit.CLUB},
                    {rank: 4, suit: CardSuit.SPADE},
                    {rank: 3, suit: CardSuit.HEART},
                    {rank: 8, suit: CardSuit.DIAMOND},
                    {rank: 6, suit: CardSuit.CLUB},
                ],
                [
                    {rank: 7, suit: CardSuit.HEART},
                    {rank: 7, suit: CardSuit.DIAMOND},
                    {rank: 7, suit: CardSuit.CLUB},
                    {rank: 4, suit: CardSuit.SPADE},
                    {rank: 2, suit: CardSuit.HEART},
                    {rank: 8, suit: CardSuit.DIAMOND},
                    {rank: 6, suit: CardSuit.CLUB},
                ],
                [
                    {rank: 14, suit: CardSuit.HEART},
                    {rank: 14, suit: CardSuit.DIAMOND},
                    {rank: 14, suit: CardSuit.CLUB},
                    {rank: 4, suit: CardSuit.SPADE},
                    {rank: 2, suit: CardSuit.HEART},
                    {rank: 8, suit: CardSuit.DIAMOND},
                    {rank: 6, suit: CardSuit.CLUB},
                ]
            ]

            expectRank(PokerHandRank.THREE_OF_A_KIND, threeOfAKind)
        });

        it('Two pairs', async () => {
            const twoPairs = [
                [
                    {rank: 7, suit: CardSuit.HEART},
                    {rank: 7, suit: CardSuit.DIAMOND},
                    {rank: 5, suit: CardSuit.CLUB},
                    {rank: 5, suit: CardSuit.SPADE},
                    {rank: 3, suit: CardSuit.HEART},
                    {rank: 8, suit: CardSuit.DIAMOND},
                    {rank: 6, suit: CardSuit.CLUB},
                ],
                [
                    {rank: 14, suit: CardSuit.HEART},
                    {rank: 14, suit: CardSuit.DIAMOND},
                    {rank: 10, suit: CardSuit.CLUB},
                    {rank: 10, suit: CardSuit.SPADE},
                    {rank: 3, suit: CardSuit.HEART},
                    {rank: 8, suit: CardSuit.DIAMOND},
                    {rank: 6, suit: CardSuit.CLUB},
                ],
                [
                    {rank: 7, suit: CardSuit.HEART},
                    {rank: 7, suit: CardSuit.DIAMOND},
                    {rank: 5, suit: CardSuit.CLUB},
                    {rank: 5, suit: CardSuit.SPADE},
                    {rank: 2, suit: CardSuit.HEART},
                    {rank: 8, suit: CardSuit.DIAMOND},
                    {rank: 6, suit: CardSuit.CLUB},
                ],
                [
                    {rank: 14, suit: CardSuit.HEART},
                    {rank: 14, suit: CardSuit.DIAMOND},
                    {rank: 10, suit: CardSuit.CLUB},
                    {rank: 10, suit: CardSuit.SPADE},
                    {rank: 2, suit: CardSuit.HEART},
                    {rank: 8, suit: CardSuit.DIAMOND},
                    {rank: 6, suit: CardSuit.CLUB},
                ]
            ]

            expectRank(PokerHandRank.TWO_PAIR, twoPairs)
        });

        it('One pairs', async () => {
            const onePairs = [
                [
                    {rank: 7, suit: CardSuit.HEART},
                    {rank: 7, suit: CardSuit.DIAMOND},
                    {rank: 10, suit: CardSuit.CLUB},
                    {rank: 4, suit: CardSuit.SPADE},
                    {rank: 2, suit: CardSuit.HEART},
                    {rank: 8, suit: CardSuit.DIAMOND},
                    {rank: 6, suit: CardSuit.CLUB},
                ],
                [
                    {rank: 14, suit: CardSuit.HEART},
                    {rank: 14, suit: CardSuit.DIAMOND},
                    {rank: 10, suit: CardSuit.CLUB},
                    {rank: 9, suit: CardSuit.SPADE},
                    {rank: 2, suit: CardSuit.HEART},
                    {rank: 8, suit: CardSuit.DIAMOND},
                    {rank: 6, suit: CardSuit.CLUB},
                ],
                [
                    {rank: 7, suit: CardSuit.HEART},
                    {rank: 7, suit: CardSuit.DIAMOND},
                    {rank: 5, suit: CardSuit.CLUB},
                    {rank: 4, suit: CardSuit.SPADE},
                    {rank: 2, suit: CardSuit.HEART},
                    {rank: 9, suit: CardSuit.DIAMOND},
                    {rank: 6, suit: CardSuit.CLUB},
                ],
                [
                    {rank: 14, suit: CardSuit.HEART},
                    {rank: 14, suit: CardSuit.DIAMOND},
                    {rank: 10, suit: CardSuit.CLUB},
                    {rank: 9, suit: CardSuit.SPADE},
                    {rank: 2, suit: CardSuit.HEART},
                    {rank: 8, suit: CardSuit.DIAMOND},
                    {rank: 6, suit: CardSuit.CLUB},
                ]
            ]

            expectRank(PokerHandRank.ONE_PAIR, onePairs)
        });

        it('High card', async () => {
            const highCards = [
                [
                    {rank: 7, suit: CardSuit.HEART},
                    {rank: 5, suit: CardSuit.DIAMOND},
                    {rank: 10, suit: CardSuit.CLUB},
                    {rank: 3, suit: CardSuit.SPADE},
                    {rank: 2, suit: CardSuit.HEART},
                    {rank: 8, suit: CardSuit.DIAMOND},
                    {rank: 6, suit: CardSuit.CLUB},
                ],
                [
                    {rank: 14, suit: CardSuit.HEART},
                    {rank: 13, suit: CardSuit.DIAMOND},
                    {rank: 10, suit: CardSuit.CLUB},
                    {rank: 9, suit: CardSuit.SPADE},
                    {rank: 2, suit: CardSuit.HEART},
                    {rank: 8, suit: CardSuit.DIAMOND},
                    {rank: 6, suit: CardSuit.CLUB},
                ]                                
            ]

            expectRank(PokerHandRank.HIGH_CARD, highCards)
        });
    });
});