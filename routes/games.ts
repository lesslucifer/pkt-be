import { ExpressRouter, POST } from "express-router-ts";
import { GamePlayer } from "../models/game";
import AuthServ from "../serv/auth.serv";
import { PlayerId } from "../serv/decors";
import GameServ from "../serv/game.serv";

class GamesRouter extends ExpressRouter {
    @POST({path: "/"})
    @AuthServ.authPlayer()
    async createNewGame(@PlayerId() playerId: string) {
        const game = GameServ.newGame(playerId);
        game.players.set(playerId, new GamePlayer(playerId, game))
        return game
    }
}

export default new GamesRouter()
