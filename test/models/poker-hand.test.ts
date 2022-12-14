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
                    new Card(14, CardSuit.SPADE),
                    new Card(13, CardSuit.SPADE),
                    new Card(12, CardSuit.SPADE),
                    new Card(11, CardSuit.SPADE),
                    new Card(10, CardSuit.SPADE),
                    new Card(8, CardSuit.DIAMOND),
                    new Card(6, CardSuit.CLUB),
                ],
                [
                    new Card(14, CardSuit.HEART),
                    new Card(13, CardSuit.HEART),
                    new Card(12, CardSuit.HEART),
                    new Card(11, CardSuit.HEART),
                    new Card(10, CardSuit.HEART),
                    new Card(7, CardSuit.DIAMOND),
                    new Card(5, CardSuit.CLUB),
                ],
                [
                    new Card(14, CardSuit.SPADE),
                    new Card(13, CardSuit.SPADE),
                    new Card(12, CardSuit.SPADE),
                    new Card(11, CardSuit.SPADE),
                    new Card(10, CardSuit.SPADE),
                    new Card(8, CardSuit.DIAMOND),
                    new Card(6, CardSuit.CLUB),
                ]

            ]

            expectRank(PokerHandRank.ROYAL_FLUSH, royalFlushes)
        });

        it('Straight flush', async () => {
            const straightFlushses = [
                [
                    new Card(6, CardSuit.SPADE),
                    new Card(10, CardSuit.SPADE),
                    new Card(9, CardSuit.SPADE),
                    new Card(8, CardSuit.SPADE),
                    new Card(14, CardSuit.HEART),
                    new Card(7, CardSuit.SPADE),
                    new Card(11, CardSuit.SPADE),
                ],
                [
                    new Card(3, CardSuit.DIAMOND),
                    new Card(7, CardSuit.DIAMOND),
                    new Card(6, CardSuit.DIAMOND),
                    new Card(5, CardSuit.DIAMOND),
                    new Card(13, CardSuit.SPADE),
                    new Card(4, CardSuit.DIAMOND),
                    new Card(12, CardSuit.SPADE),
                ],
                [
                    new Card(3, CardSuit.DIAMOND),
                    new Card(7, CardSuit.DIAMOND),
                    new Card(6, CardSuit.DIAMOND),
                    new Card(5, CardSuit.DIAMOND),
                    new Card(13, CardSuit.SPADE),
                    new Card(4, CardSuit.DIAMOND),
                    new Card(12, CardSuit.SPADE),
                ],
                [
                    new Card(4, CardSuit.CLUB),
                    new Card(8, CardSuit.CLUB),
                    new Card(7, CardSuit.CLUB),
                    new Card(6, CardSuit.CLUB),
                    new Card(14, CardSuit.SPADE),
                    new Card(5, CardSuit.CLUB),
                    new Card(13, CardSuit.SPADE),
                ],
                [
                    new Card(14, CardSuit.CLUB),
                    new Card(2, CardSuit.CLUB),
                    new Card(3, CardSuit.CLUB),
                    new Card(4, CardSuit.CLUB),
                    new Card(5, CardSuit.CLUB),
                    new Card(8, CardSuit.DIAMOND),
                    new Card(6, CardSuit.HEART),
                ],
                [
                    new Card(7, CardSuit.HEART),
                    new Card(6, CardSuit.HEART),
                    new Card(5, CardSuit.HEART),
                    new Card(4, CardSuit.HEART),
                    new Card(3, CardSuit.HEART),
                    new Card(2, CardSuit.DIAMOND),
                    new Card(1, CardSuit.CLUB),
                ],
                [
                    new Card(7, CardSuit.HEART),
                    new Card(7, CardSuit.DIAMOND),
                    new Card(5, CardSuit.HEART),
                    new Card(4, CardSuit.HEART),
                    new Card(3, CardSuit.HEART),
                    new Card(6, CardSuit.HEART),
                    new Card(2, CardSuit.CLUB),
                ]
            ]

            expectRank(PokerHandRank.STRAIGHT_FLUSH, straightFlushses)
        });

        it('Quads', async () => {
            const quads = [
                [
                    new Card(7, CardSuit.HEART),
                    new Card(7, CardSuit.DIAMOND),
                    new Card(7, CardSuit.CLUB),
                    new Card(7, CardSuit.SPADE),
                    new Card(3, CardSuit.HEART),
                    new Card(2, CardSuit.DIAMOND),
                    new Card(1, CardSuit.CLUB),
                ],
                [
                    new Card(14, CardSuit.HEART),
                    new Card(14, CardSuit.DIAMOND),
                    new Card(14, CardSuit.CLUB),
                    new Card(14, CardSuit.SPADE),
                    new Card(5, CardSuit.HEART),
                    new Card(2, CardSuit.DIAMOND),
                    new Card(1, CardSuit.CLUB),
                ]
            ]

            expectRank(PokerHandRank.FOUR_OF_A_KIND, quads)
        });

        it('Fullhouse', async () => {
            const fullHouses = [
                [
                    new Card(7, CardSuit.HEART),
                    new Card(7, CardSuit.DIAMOND),
                    new Card(7, CardSuit.CLUB),
                    new Card(3, CardSuit.SPADE),
                    new Card(3, CardSuit.HEART),
                    new Card(3, CardSuit.DIAMOND),
                    new Card(2, CardSuit.CLUB),
                ],
                [
                    new Card(14, CardSuit.HEART),
                    new Card(14, CardSuit.DIAMOND),
                    new Card(14, CardSuit.CLUB),
                    new Card(2, CardSuit.SPADE),
                    new Card(2, CardSuit.HEART),
                    new Card(2, CardSuit.DIAMOND),
                    new Card(3, CardSuit.CLUB),
                ],
                [
                    new Card(7, CardSuit.HEART),
                    new Card(7, CardSuit.DIAMOND),
                    new Card(7, CardSuit.CLUB),
                    new Card(5, CardSuit.SPADE),
                    new Card(5, CardSuit.HEART),
                    new Card(5, CardSuit.DIAMOND),
                    new Card(3, CardSuit.CLUB),
                ],
                [
                    new Card(14, CardSuit.HEART),
                    new Card(14, CardSuit.DIAMOND),
                    new Card(14, CardSuit.CLUB),
                    new Card(10, CardSuit.SPADE),
                    new Card(10, CardSuit.HEART),
                    new Card(10, CardSuit.DIAMOND),
                    new Card(2, CardSuit.CLUB),
                ]
            ]

            expectRank(PokerHandRank.FULLHOUSE, fullHouses)
        });

        it('Flush', async () => {
            const flushes = [
                [
                    new Card(14, CardSuit.DIAMOND),
                    new Card(13, CardSuit.DIAMOND),
                    new Card(12, CardSuit.DIAMOND),
                    new Card(11, CardSuit.DIAMOND),
                    new Card(9, CardSuit.DIAMOND),
                    new Card(8, CardSuit.DIAMOND),
                    new Card(6, CardSuit.CLUB),
                ],
                [
                    new Card(7, CardSuit.HEART),
                    new Card(5, CardSuit.HEART),
                    new Card(3, CardSuit.HEART),
                    new Card(2, CardSuit.HEART),
                    new Card(10, CardSuit.HEART),
                    new Card(8, CardSuit.DIAMOND),
                    new Card(4, CardSuit.CLUB),
                ],
                [
                    new Card(7, CardSuit.CLUB),
                    new Card(5, CardSuit.CLUB),
                    new Card(3, CardSuit.CLUB),
                    new Card(2, CardSuit.CLUB),
                    new Card(10, CardSuit.CLUB),
                    new Card(8, CardSuit.DIAMOND),
                    new Card(6, CardSuit.HEART),
                ],
                [
                    new Card(7, CardSuit.HEART),
                    new Card(5, CardSuit.HEART),
                    new Card(4, CardSuit.HEART),
                    new Card(3, CardSuit.HEART),
                    new Card(2, CardSuit.HEART),
                    new Card(8, CardSuit.DIAMOND),
                    new Card(6, CardSuit.CLUB),
                ],
                [
                    new Card(7, CardSuit.HEART),
                    new Card(7, CardSuit.DIAMOND),
                    new Card(5, CardSuit.HEART),
                    new Card(4, CardSuit.HEART),
                    new Card(3, CardSuit.HEART),
                    new Card(10, CardSuit.HEART),
                    new Card(2, CardSuit.CLUB),
                ]
                
            ]

            expectRank(PokerHandRank.FLUSH, flushes)
        });

        it('Straight', async () => {
            const straights = [
                [
                    new Card(7, CardSuit.HEART),
                    new Card(6, CardSuit.DIAMOND),
                    new Card(5, CardSuit.CLUB),
                    new Card(4, CardSuit.SPADE),
                    new Card(3, CardSuit.HEART),
                    new Card(8, CardSuit.DIAMOND),
                    new Card(6, CardSuit.CLUB),
                ],
                [
                    new Card(14, CardSuit.HEART),
                    new Card(13, CardSuit.DIAMOND),
                    new Card(12, CardSuit.CLUB),
                    new Card(11, CardSuit.SPADE),
                    new Card(10, CardSuit.HEART),
                    new Card(8, CardSuit.DIAMOND),
                    new Card(6, CardSuit.CLUB),
                ],
                [
                    new Card(7, CardSuit.HEART),
                    new Card(6, CardSuit.HEART),
                    new Card(5, CardSuit.HEART),
                    new Card(4, CardSuit.HEART),
                    new Card(3, CardSuit.DIAMOND),
                    new Card(8, CardSuit.DIAMOND),
                    new Card(6, CardSuit.CLUB),
                ],
                [
                    new Card(7, CardSuit.HEART),
                    new Card(7, CardSuit.DIAMOND),
                    new Card(5, CardSuit.CLUB),
                    new Card(4, CardSuit.SPADE),
                    new Card(3, CardSuit.HEART),
                    new Card(6, CardSuit.DIAMOND),
                    new Card(2, CardSuit.CLUB),
                ],
                [
                    new Card(7, CardSuit.HEART),
                    new Card(7, CardSuit.DIAMOND),
                    new Card(5, CardSuit.CLUB),
                    new Card(4, CardSuit.SPADE),
                    new Card(3, CardSuit.HEART),
                    new Card(6, CardSuit.DIAMOND),
                    new Card(2, CardSuit.CLUB),
                ]
            ]

            expectRank(PokerHandRank.STRAIGHT, straights)
        });

        it('Three of a kind', async () => {
            const threeOfAKind = [
                [
                    new Card(7, CardSuit.HEART),
                    new Card(7, CardSuit.DIAMOND),
                    new Card(7, CardSuit.CLUB),
                    new Card(4, CardSuit.SPADE),
                    new Card(3, CardSuit.HEART),
                    new Card(8, CardSuit.DIAMOND),
                    new Card(6, CardSuit.CLUB),
                ],
                [
                    new Card(14, CardSuit.HEART),
                    new Card(14, CardSuit.DIAMOND),
                    new Card(14, CardSuit.CLUB),
                    new Card(4, CardSuit.SPADE),
                    new Card(3, CardSuit.HEART),
                    new Card(8, CardSuit.DIAMOND),
                    new Card(6, CardSuit.CLUB),
                ],
                [
                    new Card(7, CardSuit.HEART),
                    new Card(7, CardSuit.DIAMOND),
                    new Card(7, CardSuit.CLUB),
                    new Card(4, CardSuit.SPADE),
                    new Card(2, CardSuit.HEART),
                    new Card(8, CardSuit.DIAMOND),
                    new Card(6, CardSuit.CLUB),
                ],
                [
                    new Card(14, CardSuit.HEART),
                    new Card(14, CardSuit.DIAMOND),
                    new Card(14, CardSuit.CLUB),
                    new Card(4, CardSuit.SPADE),
                    new Card(2, CardSuit.HEART),
                    new Card(8, CardSuit.DIAMOND),
                    new Card(6, CardSuit.CLUB),
                ]
            ]

            expectRank(PokerHandRank.THREE_OF_A_KIND, threeOfAKind)
        });

        it('Two pairs', async () => {
            const twoPairs = [
                [
                    new Card(7, CardSuit.HEART),
                    new Card(7, CardSuit.DIAMOND),
                    new Card(5, CardSuit.CLUB),
                    new Card(5, CardSuit.SPADE),
                    new Card(3, CardSuit.HEART),
                    new Card(8, CardSuit.DIAMOND),
                    new Card(6, CardSuit.CLUB),
                ],
                [
                    new Card(14, CardSuit.HEART),
                    new Card(14, CardSuit.DIAMOND),
                    new Card(10, CardSuit.CLUB),
                    new Card(10, CardSuit.SPADE),
                    new Card(3, CardSuit.HEART),
                    new Card(8, CardSuit.DIAMOND),
                    new Card(6, CardSuit.CLUB),
                ],
                [
                    new Card(7, CardSuit.HEART),
                    new Card(7, CardSuit.DIAMOND),
                    new Card(5, CardSuit.CLUB),
                    new Card(5, CardSuit.SPADE),
                    new Card(2, CardSuit.HEART),
                    new Card(8, CardSuit.DIAMOND),
                    new Card(6, CardSuit.CLUB),
                ],
                [
                    new Card(14, CardSuit.HEART),
                    new Card(14, CardSuit.DIAMOND),
                    new Card(10, CardSuit.CLUB),
                    new Card(10, CardSuit.SPADE),
                    new Card(2, CardSuit.HEART),
                    new Card(8, CardSuit.DIAMOND),
                    new Card(6, CardSuit.CLUB),
                ]
            ]

            expectRank(PokerHandRank.TWO_PAIR, twoPairs)
        });

        it('One pairs', async () => {
            const onePairs = [
                [
                    new Card(7, CardSuit.HEART),
                    new Card(7, CardSuit.DIAMOND),
                    new Card(10, CardSuit.CLUB),
                    new Card(4, CardSuit.SPADE),
                    new Card(2, CardSuit.HEART),
                    new Card(8, CardSuit.DIAMOND),
                    new Card(6, CardSuit.CLUB),
                ],
                [
                    new Card(14, CardSuit.HEART),
                    new Card(14, CardSuit.DIAMOND),
                    new Card(10, CardSuit.CLUB),
                    new Card(9, CardSuit.SPADE),
                    new Card(2, CardSuit.HEART),
                    new Card(8, CardSuit.DIAMOND),
                    new Card(6, CardSuit.CLUB),
                ],
                [
                    new Card(7, CardSuit.HEART),
                    new Card(7, CardSuit.DIAMOND),
                    new Card(5, CardSuit.CLUB),
                    new Card(4, CardSuit.SPADE),
                    new Card(2, CardSuit.HEART),
                    new Card(9, CardSuit.DIAMOND),
                    new Card(6, CardSuit.CLUB),
                ],
                [
                    new Card(14, CardSuit.HEART),
                    new Card(14, CardSuit.DIAMOND),
                    new Card(10, CardSuit.CLUB),
                    new Card(9, CardSuit.SPADE),
                    new Card(2, CardSuit.HEART),
                    new Card(8, CardSuit.DIAMOND),
                    new Card(6, CardSuit.CLUB),
                ]
            ]

            expectRank(PokerHandRank.ONE_PAIR, onePairs)
        });

        it('High card', async () => {
            const highCards = [
                [
                    new Card(7, CardSuit.HEART),
                    new Card(5, CardSuit.DIAMOND),
                    new Card(10, CardSuit.CLUB),
                    new Card(3, CardSuit.SPADE),
                    new Card(2, CardSuit.HEART),
                    new Card(8, CardSuit.DIAMOND),
                    new Card(6, CardSuit.CLUB),
                ],
                [
                    new Card(14, CardSuit.HEART),
                    new Card(13, CardSuit.DIAMOND),
                    new Card(10, CardSuit.CLUB),
                    new Card(9, CardSuit.SPADE),
                    new Card(2, CardSuit.HEART),
                    new Card(8, CardSuit.DIAMOND),
                    new Card(6, CardSuit.CLUB),
                ]                                
            ]

            expectRank(PokerHandRank.HIGH_CARD, highCards)
        });
    });
});