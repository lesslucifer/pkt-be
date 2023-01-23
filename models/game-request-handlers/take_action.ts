import { AppLogicError } from "../../utils/hera";
import { Game } from "../game";
import { ActionType, IPlayerAction } from "../game-hand";
import { BaseGameRequestHandler } from "./base";


export class TakeActionGameRequestHandler extends BaseGameRequestHandler<IPlayerAction> {
    type = 'TAKE_ACTION'
    schema = {
        '+action': { enum: Object.values(ActionType) },
        '@amount': 'integer'
    }

    async process(game: Game, playerId: string, req: IPlayerAction) {
        if (!game.hand) throw new AppLogicError(`Cannot take action, no current hand`)
        game.hand.takeAction(playerId, req)
    }
}