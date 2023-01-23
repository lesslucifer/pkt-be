import { AppLogicError } from "../../utils/hera";
import { Game, GameStatus } from "../game";
import { GameLogAction } from "../game-log";
import { BaseGameRequestHandler } from "./base";

export class UnstopGameGameRequestHandler extends BaseGameRequestHandler {
    type = 'UNSTOP_GAME'
    schema = {}

    async process(game: Game, playerId: string) {
        if (game.ownerId !== playerId) throw new AppLogicError(`Cannot unstop the game. Only owner can perform this action`, 403)
        if (game.status === GameStatus.STOPPED) throw new AppLogicError(`Cannot unstop the game. The game is already stopped`)
        if (!game.requests.stopGame) throw new AppLogicError(`Cannot unstop the game. The game is not being requested to stop`)
        game.requests.stopGame = false

        game.addLogs([{ action: GameLogAction.REQUEST_UNSTOP_GAME, player: playerId }])
    }
}