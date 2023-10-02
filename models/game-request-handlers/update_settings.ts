import { AppLogicError } from "../../utils/hera";
import { HoldemPokerGame, GameSettings } from "../holdem/game";
import { GameLogAction } from "../holdem/game-log";
import { BaseGameRequestHandler } from "./base";

export class UpdateSettingsGameRequestHandler extends BaseGameRequestHandler<GameSettings> {
    type = 'UPDATE_SETTINGS'
    schema = {
        '+@actionTime': 'number|>=3000|<=300000',
        '+@smallBlind': 'integer|>=1',
        '+@bigBlind': 'integer|>=1',
        '+@gameSpeed': 'number|>=100|<=10000',
        '+@showDownTime': 'number|>=1000|<=120000',
        '++': false
    }

    async process(game: HoldemPokerGame, playerId: string, req: GameSettings) {
        if (playerId !== game.ownerId) throw new AppLogicError(`Cannot transfer ownership. Owner action`, 403)
        if (req.bigBlind < req.smallBlind) throw new AppLogicError(`Big blind must not be less than small blind`, 400)

        game.addLogs([{
            action: GameLogAction.REQUEST_UPDATE_SETTINGS,
            settings: req
        }])
        if (!game.hand) {
            game.settings = req
            game.addLogs([{
                action: GameLogAction.UPDATE_SETTINGS,
                settings: req
            }])
        }
        else {
            game.requests.settings = req
        }
    }
}