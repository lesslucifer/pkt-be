import { AppLogicError } from "../../utils/hera";
import { HoldemPokerGame } from "../holdem/game";
import { GameHandStatus, HandStepType } from "../holdem/game-hand";
import { BaseGameRequestHandler } from "./base";

export class ShowCardsGameRequestHandler extends BaseGameRequestHandler {
    type = 'SHOW_CARDS'
    schema = {}

    async process(game: HoldemPokerGame, playerId: string) {
        const hand = game.hand
        if (!hand || hand.status != GameHandStatus.SHOWING_DOWN) {
            throw new AppLogicError(`Cannot show cards! Hand round and status mismatch`)
        }

        const hp = hand.playersMap.get(playerId)
        if (!hp) throw new AppLogicError(`Player not in the hand`)

        if (!hp.showCard) {
            hp.showCard = true
            hand.markDirty({
                type: HandStepType.SHOW_CARDS,
                player: playerId,
                cards: hand.playerCards[hp.id]
            })
        }
    }
}