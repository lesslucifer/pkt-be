import GameServ from "../../serv/game.serv";
import { Game } from "../game";
import { BaseGameRequestHandler } from "./base";

export class RequestCardsGameRequestHandler extends BaseGameRequestHandler {
    type = 'REQ_CARDS'
    schema = {}

    async process(game: Game, playerId: string) {
        GameServ.sendPlayerCards(game, playerId)
    }
}