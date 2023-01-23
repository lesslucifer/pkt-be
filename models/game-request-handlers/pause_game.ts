import { AppLogicError } from "../../utils/hera";
import { Game, GameStatus } from "../game";
import { GameLogAction } from "../game-log";
import { BaseGameRequestHandler } from "./base";

export class PauseGameGameRequestHandler extends BaseGameRequestHandler {
    type = 'PAUSE_GAME'
    schema = {}

    async process(game: Game, playerId: string) {
        if (game.ownerId !== playerId) throw new AppLogicError(`Cannot pause the game. Only owner can perform this action`, 403)
        if (game.status !== GameStatus.PLAYING) throw new AppLogicError(`Cannot pause the game. The game must be playing`, 403)

        game.status = GameStatus.PAUSED
        game.addLogs([{ action: GameLogAction.PAUSE_GAME, player: playerId }])
    }
}