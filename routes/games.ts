import { Body, ExpressRouter, GET, POST, PUT } from "express-router-ts";
import HC from "../glob/hc";
import { GamePlayer } from "../models/game";
import AuthServ from "../serv/auth.serv";
import { CurrentPlayer, IntParams, Player } from "../serv/decors";
import GameServ from "../serv/game.serv";
import { ValidBody } from "../utils/decors";
import { AppLogicError } from "../utils/hera";

class GamesRouter extends ExpressRouter {
    @GET({path: "/"})
    @AuthServ.authPlayer()
    async getAllGames(@Player() playerId: string) {
        return [...GameServ.games.values()]
    }

    @POST({path: "/"})
    @AuthServ.authPlayer()
    async createNewGame(@Player() playerId: string) {
        const game = GameServ.newGame(playerId);
        return game
    }

    @PUT({path: "/seats/:seat"})
    @ValidBody({
        '+@buyIn': 'integer'
    })
    @AuthServ.authGamePlayer()
    async takeSeat(@CurrentPlayer() gamePlayer: GamePlayer,
    @IntParams('seat') seat: number, @Body('buyIn') buyIn: number) {
        const game = gamePlayer.game
        if (game.seats[seat]) throw new AppLogicError(`The seat is already taken`)
        if (gamePlayer.bank + buyIn <= 0) throw new AppLogicError(`Buy in amoutn is insufficient`)

        gamePlayer.bank += buyIn
        game.seats[seat] = gamePlayer

        return HC.SUCCESS
    }
}

export default new GamesRouter()
