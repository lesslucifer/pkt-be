import { Body, ExpressRouter, GET, Params, POST, PUT } from "express-router-ts";
import _ from "lodash";
import HC from "../glob/hc";
import { Game, GamePlayer, GameSettings, GameStatus, IStackRequest } from "../models/game";
import { ActionType, GameHandStatus, IPlayerAction } from "../models/game-hand";
import AuthServ from "../serv/auth.serv";
import { CurrentGame, IntParams, Player, PlayerId } from "../serv/decors";
import GameServ from "../serv/game.serv";
import { ValidBody } from "../utils/decors";
import { AppLogicError } from "../utils/hera";

class GamesRouter extends ExpressRouter {
    @GET({path: "/"})
    @AuthServ.authPlayer()
    @AuthServ.authGame()
    async getCurrentGame(@CurrentGame() game: Game) {
        return game.toJSON()
    }

    @PUT({path: "/ownerId"})
    @ValidBody({
        '+@newOwner': 'string'
    })
    @AuthServ.authGamePlayer()
    async transferGameOwnership(@Player() gamePlayer: GamePlayer, @Body('newOwner') newOwnerId: string) {
        const game = gamePlayer.game
        if (gamePlayer.id !== game.ownerId) throw new AppLogicError(`Cannot transfer ownership. Owner action`, 403)
        if (!game.players.get(newOwnerId)) throw new AppLogicError(`Cannot transfer ownership. Player not found`, 403)

        game.ownerId = newOwnerId
        game.markDirty()

        return HC.SUCCESS
    }

    @PUT({path: "/players/:playerId/stack"})
    @ValidBody({
        '+type': { enum: ['ADD', 'SET'] },
        '+@amount': 'integer',
        '++': false
    })
    @AuthServ.authGamePlayer()
    async updateStack(@Player() owner: GamePlayer, @Params('playerId') playerId: string, @Body() reqStackUpdate: IStackRequest) {
        const game = owner.game
        if (owner.id !== game.ownerId) throw new AppLogicError(`Cannot transfer ownership. Owner action`, 403)
        
        game.requestStackUpdate(playerId, reqStackUpdate)
        
        return HC.SUCCESS
    }

    @PUT({path: "/settings"})
    @ValidBody({
        '+@actionTime': 'number|>=3000|<=300000',
        '+@smallBlind': 'integer|>=1',
        '+@bigBlind': 'integer|>=1',
        '+@gameSpeed': 'number|>=100|<=10000',
        '+@showDownTime': 'number|>=1000|<=120000',
        '++': false
    })
    @AuthServ.authGamePlayer()
    async updateSettings(@Player() gamePlayer: GamePlayer, @Body() newSettings: GameSettings) {
        const game = gamePlayer.game
        if (gamePlayer.id !== game.ownerId) throw new AppLogicError(`Cannot transfer ownership. Owner action`, 403)
        if (newSettings.bigBlind <= newSettings.smallBlind) throw new AppLogicError(`Big blind must be greater than small blind`, 400)
        
        if (!game.hand) {
            game.settings = newSettings
            game.markDirty()
        }
        else {
            game.requests.settings = newSettings
            game.markDirty(true, false)
        }
        
        return HC.SUCCESS
    }

    @PUT({path: "/seats/leave"})
    @AuthServ.authGamePlayer()
    async leaveSeat(@Player() gamePlayer: GamePlayer) {
        const game = gamePlayer.game
        const mySeat = game.seats.indexOf(gamePlayer.id)
        if (mySeat < 0) throw new AppLogicError(`Cannot leave seat. You are not having a seat`)

        game.requestLeaveSeat(gamePlayer)

        return game.toJSON()
    }

    @PUT({path: `/players/:playerId/leave`})
    @AuthServ.authGamePlayer()
    async kickPlayer(@Player() gamePlayer: GamePlayer, @Params('playerId') playerId: string) {
        const game = gamePlayer.game
        if (gamePlayer.id !== game.ownerId) throw new AppLogicError(`Cannot kick player. Owner action`, 403)

        const seat = game.seats.indexOf(playerId)
        if (seat < 0) throw new AppLogicError(`Cannot leave seat. You are not having a seat`)

        game.requestLeaveSeat(game.players.get(playerId))

        return HC.SUCCESS
    }

    @PUT({path: "/seats/unleave"})
    @AuthServ.authGamePlayer()
    async unLeaveSeat(@Player() gamePlayer: GamePlayer) {
        const game = gamePlayer.game
        const mySeat = game.seats.indexOf(gamePlayer.id)
        if (mySeat < 0) throw new AppLogicError(`Cannot unleave seat. You are not having a seat`)
        
        const idx = game.requests.seatOut.indexOf(mySeat)
        if (idx < 0) throw new AppLogicError(`Cannot unleave seat. You haven't request to leave`)

        game.requests.seatOut.splice(idx, 1)
        game.markDirty(true, false)

        return game.toJSON()
    }

    @PUT({path: "/seats/shuffled"})
    @AuthServ.authGamePlayer()
    async shuffleSeat(@Player() gamePlayer: GamePlayer) {
        const game = gamePlayer.game
        if (game.ownerId !== gamePlayer.id) throw new AppLogicError(`Cannot shuffle seats! Only owner can perform this action`, 403)
        
        game.seats = _.shuffle(game.seats)
        game.markDirty()

        return game.toJSON()
    }

    @PUT({path: "/seats/:seat"})
    @ValidBody({
        '+@buyIn': 'integer',
        '+@name': 'string|len>=2|len<=10'
    })
    @AuthServ.authGame()
    @AuthServ.authPlayer()
    async takeSeat(@PlayerId() playerId: string, @CurrentGame() game: Game,
    @IntParams('seat') seat: number, @Body('buyIn') buyIn: number, @Body('name') name: string) {
        game.requestSeat(playerId, seat, buyIn, name)
        return game.toJSON()
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
        if (game.status === GameStatus.STOPPED) throw new AppLogicError(`Cannot stop the game. The game is already stopped`)
        game.requests.stopGame = true
        game.markDirty(true, false)

        return game.toJSON()
    }

    @PUT({path: "/status/unstopped"})
    @AuthServ.authGamePlayer()
    async unStopGame(@Player() gamePlayer: GamePlayer) {
        const game = gamePlayer.game
        if (game.ownerId !== gamePlayer.id) throw new AppLogicError(`Cannot unstop the game. Only owner can perform this action`, 403)
        if (game.status === GameStatus.STOPPED) throw new AppLogicError(`Cannot unstop the game. The game is already stopped`)
        if (!game.requests.stopGame) throw new AppLogicError(`Cannot unstop the game. The game is not being requested to stop`)
        game.requests.stopGame = false
        game.markDirty(true, false)

        return game.toJSON()
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

        game.hand.takeAction(player.id, action)

        return game.toJSON()
    }

    @PUT({path: "/hand/showCards/true"})
    @AuthServ.authGamePlayer()
    async showCards(@Player() player: GamePlayer) {
        const hand = player.game.hand
        if (!hand || hand.status != GameHandStatus.SHOWING_DOWN) {
            throw new AppLogicError(`Cannot show cards! Hand round and status mismatch`)
        }
    
        const hp = hand.playersMap.get(player.id)
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
        GameServ.playerConnect(game, playerId, socketId)
        return HC.SUCCESS
    }

    @POST({path: "/messages"})
    @ValidBody({
        '+@id': 'string',
        '+@content': 'string'
    })
    @AuthServ.authPlayer()
    @AuthServ.authGame()
    async sendMessage(@PlayerId() playerId: string, @CurrentGame() game: Game, @Body() msg: any) {
        GameServ.sendMessage(game.id, {
            author: playerId,
            ...msg
        })
        return HC.SUCCESS
    }

    @GET({path: "/hand/cards"})
    @AuthServ.authPlayer()
    @AuthServ.authGame()
    async getMyCard(@PlayerId() playerId: string, @CurrentGame() game: Game) {
        const cards = game.hand?.playerCards?.[playerId]
        if (!cards) return cards
        return {
            hand: game.hand.id,
            cards
        }
    }
}

export default new GamesRouter()
