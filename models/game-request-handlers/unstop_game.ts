import { AppLogicError } from "../../utils/hera";
import { HoldemPokerGame, GameStatus } from "../holdem/game";
import { GameLogAction } from "../holdem/game-log";
import { BaseGameRequestHandler } from "./base";

export class UnstopGameGameRequestHandler extends BaseGameRequestHandler {
    type = 'UNSTOP_GAME'
    schema = {}

    async process(game: HoldemPokerGame, playerId: string) {
        if (game.ownerId !== playerId) throw new AppLogicError(`Cannot unstop the game. Only owner can perform this action`, 403)
        if (game.status !== GameStatus.PLAYING) throw new AppLogicError(`Cannot unstop the game. The game is not playing`)
        if (!game.requests.stopGame) throw new AppLogicError(`Cannot unstop the game. The game is not being requested to stop`)
        game.requests.stopGame = false

        game.addLogs([{ action: GameLogAction.REQUEST_UNSTOP_GAME, player: playerId }])
    }
}