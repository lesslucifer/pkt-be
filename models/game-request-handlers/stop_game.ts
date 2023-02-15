import { AppLogicError } from "../../utils/hera";
import { Game, GameStatus } from "../game";
import { GameLogAction } from "../game-log";
import { BaseGameRequestHandler } from "./base";

export class StopGameGameRequestHandler extends BaseGameRequestHandler {
    type = 'STOP_GAME'
    schema = {}

    async process(game: Game, playerId: string) {
        if (game.ownerId !== playerId) throw new AppLogicError(`Cannot stop the game. Only owner can perform this action`, 403)
        if (game.status === GameStatus.STOPPED || game.status === GameStatus.CLOSED) throw new AppLogicError(`Cannot stop the game. The game is already stopped`)
        game.requests.stopGame = true

        game.addLogs([{ action: GameLogAction.REQUEST_STOP_GAME, player: playerId }])
    }
}