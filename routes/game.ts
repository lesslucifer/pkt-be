import { Body, ExpressRouter, GET, Params, POST, PUT } from "express-router-ts";
import _ from "lodash";
import HC from "../glob/hc";
import { Game, GamePlayer, GameStatus } from "../models/game";
import { ActionType, GameHandStatus, HandRound, IPlayerAction } from "../models/game-hand";
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

    @PUT({path: "/seats/leave"})
    @AuthServ.authGamePlayer()
    async leaveSeat(@Player() gamePlayer: GamePlayer) {
        gamePlayer.game.addNoHandAction({
            action: 'LEAVE_SEAT',
            params: { playerId: gamePlayer.id }
        })

        gamePlayer.game.markDirty()

        return HC.SUCCESS
    }

    @PUT({path: "/seats/shuffled"})
    @AuthServ.authGamePlayer()
    async shuffleSeat(@Player() gamePlayer: GamePlayer) {
        const game = gamePlayer.game
        if (game.ownerId !== gamePlayer.id) throw new AppLogicError(`Cannot shuffle seats! Only owner can perform this action`, 403)
        
        game.seats = _.shuffle(game.seats)
        game.markDirty()

        return HC.SUCCESS
    }

    @PUT({path: "/seats/:seat"})
    @ValidBody({
        '+@buyIn': 'integer',
        '+@name': 'string'
    })
    @AuthServ.authGame()
    @AuthServ.authPlayer()
    async takeSeat(@PlayerId() playerId: string, @CurrentGame() game: Game,
    @IntParams('seat') seat: number, @Body('buyIn') buyIn: number, @Body('name') name: number) {
        game.addNoHandAction({
            action: 'TAKE_SEAT',
            params: {
                playerId,
                seat,
                buyIn,
                name
            }
        })

        game.markDirty()
        return HC.SUCCESS
    }

    @PUT({path: "/status/playing"})
    @AuthServ.authGamePlayer()
    async startGame(@Player() gamePlayer: GamePlayer) {
        const game = gamePlayer.game
        if (game.ownerId !== gamePlayer.id) throw new AppLogicError(`Cannot start the game. Only owner can perform this action`, 403)
        game.start()
        game.markDirty()

        return HC.SUCCESS
    }

    @PUT({path: "/status/stopped"})
    @AuthServ.authGamePlayer()
    async stopGame(@Player() gamePlayer: GamePlayer) {
        const game = gamePlayer.game
        if (game.ownerId !== gamePlayer.id) throw new AppLogicError(`Cannot stop the game. Only owner can perform this action`, 403)
        if (game.status === GameStatus.STOPPED) throw new AppLogicError(`Cannot stop the game. The game is already stopped`, 403)
        if (game.noHandActions.find(a => a.action === 'STOP_GAME')) throw new AppLogicError(`Cannot stop the game. Already have the same action`, 403)
        
        game.addNoHandAction({
            action: 'STOP_GAME',
            params: null
        })

        return HC.SUCCESS
    }

    @PUT({path: "/status/paused"})
    @AuthServ.authGamePlayer()
    async pauseGame(@Player() gamePlayer: GamePlayer) {
        const game = gamePlayer.game
        if (game.ownerId !== gamePlayer.id) throw new AppLogicError(`Cannot pause the game. Only owner can perform this action`, 403)
        if (game.status !== GameStatus.PLAYING) throw new AppLogicError(`Cannot pause the game. The game must be playing`, 403)
        
        game.status = GameStatus.PAUSED
        game.markDirty(true, false)

        return HC.SUCCESS
    }

    @PUT({path: "/status/resume"})
    @AuthServ.authGamePlayer()
    async resumeGame(@Player() gamePlayer: GamePlayer) {
        const game = gamePlayer.game
        if (game.ownerId !== gamePlayer.id) throw new AppLogicError(`Cannot resume the game. Only owner can perform this action`, 403)
        if (game.status !== GameStatus.PAUSED) throw new AppLogicError(`Cannot resume the game. The game must be paused`, 403)
        
        game.status = GameStatus.PLAYING
        game.markDirty(true, false)
        
        return HC.SUCCESS
    }

    @POST({path: "/hands"})
    @AuthServ.authGamePlayer()
    async startNewHand(@Player() player: GamePlayer) {
        const game = player.game
        if (game.hand && game.hand.status !== GameHandStatus.OVER) throw new AppLogicError(`Cannot start new hand, the current hand is not over`)

        game.hand = undefined
        game.startNewHand()
        game.markDirty()

        return HC.SUCCESS
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

    @PUT({path: "/hand/showCards/true"})
    @AuthServ.authGamePlayer()
    async showCards(@Player() player: GamePlayer, @Body() action: IPlayerAction) {
        const hand = player.game.hand
        if (!hand || hand.status != GameHandStatus.SHOWING_DOWN) {
            throw new AppLogicError(`Cannot show cards! Hand round and status mismatch`)
        }
    
        const hp = hand.players.find(p => p.player.id === player.id)
        if (!hp) throw new AppLogicError(`Player not in the hand`)
        
        if (!hp.showCard) {
            hp.showCard = true
            player.game.markDirty()
        }

        return HC.SUCCESS
    }

    @POST({path: "/sockets/:socketId"})
    @AuthServ.authPlayer()
    @AuthServ.authGame()
    async bindSocket(@PlayerId() playerId: string, @CurrentGame() game: Game, @Params('socketId') socketId: string) {
        game?.connect(playerId, socketId)
        return HC.SUCCESS
    }
}

export default new GamesRouter()
