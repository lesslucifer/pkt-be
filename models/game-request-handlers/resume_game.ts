import { AppLogicError } from "../../utils/hera";
import { Game, GameStatus } from "../game";
import { GameHandStatus } from "../game-hand";
import { GameLogAction } from "../game-log";
import { BaseGameRequestHandler } from "./base";

export class ResumeGameGameRequestHandler extends BaseGameRequestHandler {
    type = 'RESUME_GAME'
    schema = {}

    async process(game: Game, playerId: string) {
        if (game.ownerId !== playerId) throw new AppLogicError(`Cannot resume the game. Only owner can perform this action`, 403)
        if (game.status !== GameStatus.PAUSED) throw new AppLogicError(`Cannot resume the game. The game must be paused`, 403)

        game.status = GameStatus.PLAYING
        if (game.hand && game.hand.status !== GameHandStatus.OVER) {
            game.hand.resume()
        }
        else {
            game.startNewHand()
        }
        game.addLogs([{ action: GameLogAction.RESUME_GAME, player: playerId }])
    }
}