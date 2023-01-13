import { ExpressRouter, GET, POST } from "express-router-ts";
import shortid from "shortid";
import { GamePlayer } from "../models/game";
import AuthServ from "../serv/auth.serv";
import { PlayerId } from "../serv/decors";
import GameServ from "../serv/game.serv";

class PlayersRouter extends ExpressRouter {
    @POST({path: "/"})
    async newPlayer() {
        const playerId = shortid.generate()
        return {
            ...await AuthServ.authenticator.genTokens({id: playerId}),
            playerId
        }
    }

    @GET({path: "/me"})
    @AuthServ.authPlayer()
    async getMyId(@PlayerId() playerId: string) {
        return {
            playerId
        }
    }
}

export default new PlayersRouter()
