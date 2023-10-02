import shortid from "shortid";
import { AppLogicError } from "../../utils/hera";
import { HoldemPokerGame } from "../holdem/game";
import { GameLogAction } from "../holdem/game-log";
import { BaseGameRequestHandler } from "./base";

interface ITransferOwnershipRequest {
    newOwner: string
}

export class TransferOwnershipGameRequestHandler extends BaseGameRequestHandler<ITransferOwnershipRequest> {
    type = 'TRANSFER_OWNERSHIP'
    schema = {
        '+@newOwner': 'string'
    }

    async process(game: HoldemPokerGame, playerId: string, req: ITransferOwnershipRequest) {
        if (playerId !== game.ownerId) throw new AppLogicError(`Cannot transfer ownership. Owner action`, 403)
        if (!game.players.get(req.newOwner)) throw new AppLogicError(`Cannot transfer ownership. Player not found`, 403)

        game.ownerId = req.newOwner
        game.addLogs([{
            action: GameLogAction.TRANSFER_OWNERSHIP,
            player: playerId,
            owner: req.newOwner
        }]) 
    }
}