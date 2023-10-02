import { AppLogicError } from "../../utils/hera";
import { HoldemPokerGame } from "../holdem/game";
import { GameLogAction } from "../holdem/game-log";
import { BaseGameRequestHandler } from "./base";

export class StartGameGameRequestHandler extends BaseGameRequestHandler {
    type = 'START_GAME'
    schema = {}

    async process(game: HoldemPokerGame, playerId: string) {
        if (game.ownerId !== playerId) throw new AppLogicError(`Cannot start the game. Only owner can perform this action`, 403)
        game.start()
        game.addLogs([{ action: GameLogAction.START_GAME, player: playerId }])
    }
}