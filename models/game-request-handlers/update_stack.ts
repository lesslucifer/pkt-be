import { AppLogicError } from "../../utils/hera";
import { Game, IStackRequest } from "../game";
import { BaseGameRequestHandler } from "./base";

interface UpdateStackGameRequest extends IStackRequest {
    player: string
}

export class UpdateStackGameRequestHandler extends BaseGameRequestHandler<UpdateStackGameRequest> {
    type = 'UPDATE_STACK'
    schema = {
        '+mode': { enum: ['ADD', 'SET'] },
        '+@player': 'string',
        '+@amount': 'integer',
        '++': false
    }

    async process(game: Game, playerId: string, req: UpdateStackGameRequest) {
        if (playerId !== game.ownerId) throw new AppLogicError(`Cannot transfer ownership. Owner action`, 403)
        game.requestStackUpdate(req.player, {
            mode: req.mode,
            amount: req.amount
        })
    }
}