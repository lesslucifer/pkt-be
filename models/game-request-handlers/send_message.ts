import GameServ from "../../serv/game.serv";
import { AppLogicError } from "../../utils/hera";
import { Game, IStackRequest } from "../game";
import { GameHandStatus, HandStepType } from "../game-hand";
import { BaseGameRequestHandler } from "./base";

export class SendMessageGameRequestHandler extends BaseGameRequestHandler {
    type = 'SEND_MESSAGE'
    schema = {
        '+@id': 'string',
        '+@content': 'string|len<=1000'
    }

    async process(game: Game, playerId: string, req: any) {
        GameServ.sendMessage(game.id, {
            author: playerId,
            ...req
        })
    }
}