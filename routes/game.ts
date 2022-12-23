import { Body, ExpressRouter, GET, POST, PUT } from "express-router-ts";
import _ from "lodash";
import HC from "../glob/hc";
import { Game, GamePlayer, GamePlayerStatus } from "../models/game";
import { GameHandStatus, HandPlayerStatus } from "../models/game-hand";
import AuthServ from "../serv/auth.serv";
import { CurrentGame, CurrentPlayer, IntParams, Player } from "../serv/decors";
import GameServ from "../serv/game.serv";
import { ValidBody } from "../utils/decors";
import { AppLogicError } from "../utils/hera";

class GamesRouter extends ExpressRouter {
    @GET({path: "/all"})
    @AuthServ.authPlayer()
    async getAllGames(@Player() playerId: string) {
        return [...GameServ.games.values()]
    }

    @GET({path: "/"})
    @AuthServ.authPlayer()
    @AuthServ.authGame()
    async getCurrentGame(@CurrentGame() game: Game) {
        return {
            ...game.toJSON(),
            hand: game.hand?.toJSON()
        }
    }

    @POST({path: "/new-game"})
    @AuthServ.authPlayer()
    async createNewGame(@Player() playerId: string) {
        const game = GameServ.newGame(playerId);
        game.players.set(playerId, new GamePlayer(playerId, game))
        return game
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
    async takeSeat(@CurrentPlayer() gamePlayer: GamePlayer,
    @IntParams('seat') seat: number, @Body('buyIn') buyIn: number) {
        const game = gamePlayer.game
        if (game.seats[seat]) throw new AppLogicError(`The seat is already taken`)
        if (gamePlayer.bank + buyIn <= 0) throw new AppLogicError(`Buy in amount is insufficient`)

        gamePlayer.bank += buyIn
        game.seats[seat] = gamePlayer.id

        return HC.SUCCESS
    }

    @PUT({path: "/status/playing"})
    @AuthServ.authGamePlayer()
    async startGame(@CurrentPlayer() gamePlayer: GamePlayer) {
        const game = gamePlayer.game
        game.start()

        return HC.SUCCESS
    }

    @POST({path: "/hands"})
    @AuthServ.authGamePlayer()
    async startNewHand(@CurrentPlayer() gamePlayer: GamePlayer) {
        const game = gamePlayer.game
        if (game.hand && game.hand.status !== GameHandStatus.OVER) throw new AppLogicError(`Cannot start new hand, the current hand is not over`)

        game.hand = undefined
        game.startNewHand()

        return {
            id: game.hand?.id
        }
    }

    @PUT({path: "/actions"})
    @AuthServ.authGamePlayer()
    async takeAction(@CurrentPlayer() player: GamePlayer, @Body() action: IPlayerAction) {
        const game = player.game
        if (action.action === ActionType.TIME) {
            // TODO: add extra time
        }
        else if (action.action === ActionType.FOLD) {
            const hand = game.hand
            if (!hand) throw new AppLogicError(`No hand is available`)
            const hp = hand.players.find(p => p.player)
            hp.status = HandPlayerStatus.FOLDED
        }
        else if (action.action === ActionType.BET) {
            if (_.isNil(action.amount)) throw new AppLogicError(`Must have bet amount`)
            const hand = game.hand
            if (!hand) throw new AppLogicError(`No hand is available`)
            const hp = hand.players.find(p => p.player.id === player.id)

            hand.bet(hp, action.amount)
            hand.moveNext()
        }

        return HC.SUCCESS
    }
}

export enum ActionType {
    BET = 'BET',
    FOLD = 'FOLD',
    TIME = 'TIME'
}

export interface IPlayerAction {
    action: ActionType
    amount?: number
}

export default new GamesRouter()
