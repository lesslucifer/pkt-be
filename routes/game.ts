import { Body, ExpressRouter, GET, POST, PUT } from "express-router-ts";
import HC from "../glob/hc";
import { Game, GamePlayer } from "../models/game";
import { ActionType, GameHandStatus, IPlayerAction } from "../models/game-hand";
import AuthServ from "../serv/auth.serv";
import { CurrentGame, IntParams, Player, PlayerId } from "../serv/decors";
import { ValidBody } from "../utils/decors";
import { AppLogicError } from "../utils/hera";

class GamesRouter extends ExpressRouter {
    @GET({path: "/"})
    @AuthServ.authPlayer()
    @AuthServ.authGame()
    async getCurrentGame(@CurrentGame() game: Game, @PlayerId() playerId: string) {
        return game.toJSONWithHand(game.players.get(playerId))
    }

    @PUT({path: "/players/me"})
    @AuthServ.authPlayer()
    @AuthServ.authGame()
    async joinGame(@CurrentGame() game: Game, @Player() playerId: string) {
        if (game.players.has(playerId)) throw new AppLogicError(`Player already joined the game`)
        game.players.set(playerId, new GamePlayer(playerId, game))
        return HC.SUCCESS
    }

    @PUT({path: "/seats/:seat"})
    @ValidBody({
        '+@buyIn': 'integer'
    })
    @AuthServ.authGamePlayer()
    async takeSeat(@Player() gamePlayer: GamePlayer,
    @IntParams('seat') seat: number, @Body('buyIn') buyIn: number) {
        const game = gamePlayer.game
        if (game.seats[seat]) throw new AppLogicError(`The seat is already taken`)
        if (gamePlayer.stack + buyIn <= 0) throw new AppLogicError(`Buy in amount is insufficient`)

        gamePlayer.stack += buyIn
        game.seats[seat] = gamePlayer.id

        return HC.SUCCESS
    }

    @PUT({path: "/status/playing"})
    @AuthServ.authGamePlayer()
    async startGame(@Player() gamePlayer: GamePlayer) {
        const game = gamePlayer.game
        game.start()

        return HC.SUCCESS
    }

    @POST({path: "/hands"})
    @AuthServ.authGamePlayer()
    async startNewHand(@Player() player: GamePlayer) {
        const game = player.game
        if (game.hand && game.hand.status !== GameHandStatus.OVER) throw new AppLogicError(`Cannot start new hand, the current hand is not over`)

        game.hand = undefined
        game.startNewHand()

        return game.toJSONWithHand(player)
    }

    @PUT({path: "/actions"})
    @ValidBody({
        '+action': { enum: Object.values(ActionType) },
        '@amount': 'integer'
    })
    @AuthServ.authGamePlayer()
    async takeAction(@Player() player: GamePlayer, @Body() action: IPlayerAction) {
        const game = player.game
        if (!game.hand) throw new AppLogicError(`Cannot take action, no current hand`)

        game.hand.takeAction(player, action)

        return game.toJSONWithHand(player)
    }
}

export default new GamesRouter()
