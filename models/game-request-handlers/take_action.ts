import { AppLogicError } from "../../utils/hera";
import { HoldemPokerGame } from "../holdem/game";
import { ActionType, IPlayerAction } from "../holdem/game-hand";
import { BaseGameRequestHandler } from "./base";


export class TakeActionGameRequestHandler extends BaseGameRequestHandler<IPlayerAction> {
    type = 'TAKE_ACTION'
    schema = {
        '+action': { enum: Object.values(ActionType) },
        '@amount': 'integer'
    }

    async process(game: HoldemPokerGame, playerId: string, req: IPlayerAction) {
        if (!game.hand) throw new AppLogicError(`Cannot take action, no current hand`)
        game.hand.takeAction(playerId, req)
    }
}