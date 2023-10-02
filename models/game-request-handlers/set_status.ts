import { AppLogicError } from "../../utils/hera";
import { HoldemPokerGame, GamePlayerStatus } from "../holdem/game";
import { BaseGameRequestHandler } from "./base";

interface SetPlayerStatusGameRequest {
    player: string
    status: GamePlayerStatus
}

export class SetPlayerStatusGameRequestHandler extends BaseGameRequestHandler<SetPlayerStatusGameRequest> {
    type = 'SET_PLAYER_STATUS'
    schema = {
        '+@player': 'string',
        '+status': { enum: Object.values(GamePlayerStatus) }
    }

    async process(game: HoldemPokerGame, playerId: string, req: SetPlayerStatusGameRequest) {
        if (playerId !== game.ownerId && playerId !== req.player) throw new AppLogicError(`Cannot set player status. Owner or self action`, 403)
        const player = game.players.get(req.player)
        if (!player) throw new AppLogicError(`Cannot set player status. Player not found`, 403)

        if (req.status === GamePlayerStatus.AWAY) {
            game.requestAway(player)
        }
        else {
            game.requestActive(player)
        }
    }
}