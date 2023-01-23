import _ from "lodash";
import { AppLogicError } from "../../utils/hera";
import { Game } from "../game";
import { GameLogAction } from "../game-log";
import { BaseGameRequestHandler } from "./base";

export class ShuffleSeatsGameRequestHandler extends BaseGameRequestHandler {
    type = 'SHUFFLE_SEATS'
    schema = {}

    async process(game: Game, playerId: string) {
        if (game.ownerId !== playerId) throw new AppLogicError(`Cannot shuffle seats! Only owner can perform this action`, 403)

        game.seats = _.shuffle(game.seats)
        game.addLogs([{
            action: GameLogAction.SHUFFLE_SEATS,
            player: playerId,
            seats: game.seats
        }])
    }
}