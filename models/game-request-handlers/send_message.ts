import GameServ from "../../serv/game.serv";
import { HoldemPokerGame } from "../holdem/game";
import { BaseGameRequestHandler } from "./base";

export class SendMessageGameRequestHandler extends BaseGameRequestHandler {
    type = 'SEND_MESSAGE'
    schema = {
        '+@id': 'string',
        '+@content': 'string|len<=1000'
    }

    async process(game: HoldemPokerGame, playerId: string, req: any) {
        GameServ.sendMessage(game.id, {
            author: playerId,
            ...req
        })
    }
}