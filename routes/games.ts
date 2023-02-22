import { ExpressRouter, GET, POST } from "express-router-ts";
import AuthServ from "../serv/auth.serv";
import { PlayerId } from "../serv/decors";
import GameServ from "../serv/game.serv";

class GamesRouter extends ExpressRouter {
    @POST({path: "/"})
    @AuthServ.authPlayer()
    async createNewGame(@PlayerId() playerId: string) {
        const game = GameServ.newGame(playerId);
        game.addPlayer(playerId)
        return game
    }

    @GET({path: "/cached"})
    @AuthServ.authPlayer()
    async getCachedGames(@PlayerId() playerId: string) {
        return [...GameServ.Cache.values()].map(g => g.id)
    }
}

export default new GamesRouter()
