import { AppLogicError } from "../../utils/hera";
import { Game } from "../game";
import { BaseGameRequestHandler } from "./base";

interface ITakeSeatRequest {
    seat: number
    buyIn: number
    name: string
}

export class TakeSeatGameRequestHandler extends BaseGameRequestHandler<ITakeSeatRequest> {
    type = 'TAKE_SEAT'
    schema = {
        '+@seat': 'integer|>=0|<=10',
        '+@buyIn': 'integer',
        '+@name': 'string|len>=2|len<=25'
    }

    async process(game: Game, playerId: string, req: ITakeSeatRequest) {
        game.requestSeat(playerId, req.seat, req.buyIn, req.name)
    }
}