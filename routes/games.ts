import { Body, ExpressRouter, GET, POST, PUT } from "express-router-ts";
import _ from "lodash";
import HC from "../glob/hc";
import { Game, GamePlayer, GamePlayerStatus } from "../models/game";
import { ActionType, GameHandStatus, HandPlayerStatus, IPlayerAction } from "../models/game-hand";
import AuthServ from "../serv/auth.serv";
import { CurrentGame, IntParams, Player, PlayerId } from "../serv/decors";
import GameServ from "../serv/game.serv";
import { ValidBody } from "../utils/decors";
import { AppLogicError } from "../utils/hera";

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
