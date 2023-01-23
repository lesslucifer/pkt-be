import shortid from "shortid";
import { Game } from "../game";
import { GameLogAction } from "../game-log";
import { BaseGameRequestHandler } from "./base";

export class UpdateGameSeedGameRequestHandler extends BaseGameRequestHandler {
    type = 'UPDATE_SEED'
    schema = {}

    async process(game: Game, playerId: string) {
        game.seed = shortid.generate()

        game.addLogs([{
            action: GameLogAction.UPDATE_SEED,
            player: playerId,
            seed: game.seed
        }])
    }
}