import { AppLogicError } from "../../utils/hera";
import { HoldemPokerGame, GameStatus } from "../holdem/game";
import { GameLogAction } from "../holdem/game-log";
import { BaseGameRequestHandler } from "./base";

export class RevealSeedHandler extends BaseGameRequestHandler {
    type = 'REVEAL_SEED'
    schema = {}

    async process(game: HoldemPokerGame, playerId: string) {
        if (game.ownerId !== playerId) throw new AppLogicError(`Cannot reveal game seed. Only owner can perform this action`, 403)
        if (game.status !== GameStatus.STOPPED) throw new AppLogicError(`Cannot reveal game seed. The game is not stopped`)
        game.status = GameStatus.CLOSED

        game.addLogs([{ action: GameLogAction.REVEAL_SEED, player: playerId }])
    }
}