import { AppLogicError } from "../../utils/hera";
import { Game } from "../game";
import { BaseGameRequestHandler } from "./base";

interface IKickPlayerRequest {
    player: string
}

export class KickPlayerGameRequestHandler extends BaseGameRequestHandler<IKickPlayerRequest> {
    type = 'KICK_PLAYER'
    schema = {
        '+@player': 'string'
    }

    async process(game: Game, playerId: string, req: IKickPlayerRequest) {
        if (playerId !== game.ownerId) throw new AppLogicError(`Cannot kick player. Owner action`, 403)

        const seat = game.seats.indexOf(playerId)
        if (seat < 0) throw new AppLogicError(`Cannot leave seat. You are not having a seat`)

        game.requestLeaveSeat(game.players.get(playerId))
    }
}