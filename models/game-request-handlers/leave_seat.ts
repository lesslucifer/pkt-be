import { AppLogicError } from "../../utils/hera";
import { HoldemPokerGame } from "../holdem/game";
import { BaseGameRequestHandler } from "./base";

export class LeaveSeatGameRequestHandler extends BaseGameRequestHandler {
    type = 'LEAVE_SEAT'
    schema = {}

    async process(game: HoldemPokerGame, playerId: string) {
        const mySeat = game.seats.indexOf(playerId)
        if (mySeat < 0) throw new AppLogicError(`Cannot leave seat. You are not having a seat`)

        game.requestLeaveSeat(game.players.get(playerId))
    }
}