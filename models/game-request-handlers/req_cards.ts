import GameServ from "../../serv/game.serv";
import { HoldemPokerGame } from "../holdem/game";
import { BaseGameRequestHandler } from "./base";

export class RequestCardsGameRequestHandler extends BaseGameRequestHandler {
    type = 'REQ_CARDS'
    schema = {}

    async process(game: HoldemPokerGame, playerId: string) {
        GameServ.sendPlayerCards(game, playerId)
    }
}