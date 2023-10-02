import { AppLogicError } from "../../utils/hera";
import { HoldemPokerGame } from "../holdem/game";
import { GameLogAction } from "../holdem/game-log";
import { BaseGameRequestHandler } from "./base";

export class UnleaveSeatGameRequestHandler extends BaseGameRequestHandler {
    type = 'UNLEAVE_SEAT'
    schema = {}

    async process(game: HoldemPokerGame, playerId: string) {
        const mySeat = game.seats.indexOf(playerId)
        if (mySeat < 0) throw new AppLogicError(`Cannot unleave seat. You are not having a seat`)

        const idx = game.requests.seatOut.indexOf(mySeat)
        if (idx < 0) throw new AppLogicError(`Cannot unleave seat. You haven't request to leave`)

        game.requests.seatOut.splice(idx, 1)
        game.addLogs([{
            action: GameLogAction.REQUEST_UNSEAT_OUT,
            player: playerId,
            seat: mySeat
        }])
    }
}