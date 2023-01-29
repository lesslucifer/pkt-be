import { ExpressRouter, GET, Params, POST, Query } from "express-router-ts";
import _ from "lodash";
import { ObjectId } from "mongodb";
import HC from "../glob/hc";
import { Game, GamePlayer } from "../models/game";
import AuthServ from "../serv/auth.serv";
import { CurrentGame, IntParams, Player, PlayerId } from "../serv/decors";
import GameServ from "../serv/game.serv";

class GamesRouter extends ExpressRouter {
    @GET({ path: "/" })
    @AuthServ.authPlayer()
    @AuthServ.authGame()
    async getCurrentGame(@CurrentGame() game: Game) {
        return game.toJSON()
    }

    @GET({ path: "/logs" })
    @AuthServ.authPlayer()
    @AuthServ.authGame()
    async getGameLogs(@CurrentGame() game: Game, @Query() query: any) {
        const q = {
            id: game.id
        }
        if (query.from) {
            q['_id'] = { $lt: ObjectId.createFromHexString(query.from) }
        }

        const data = await GameServ.GameLogsModel.find(q).limit(50).sort({ _id: 'desc' }).toArray()
        const logs = !query.from ? [...game.logs] : []
        logs.push(...data.flatMap(d => _.reverse(d.logs)))

        return {
            logs,
            lastId: _.last(data)?._id
        }
    }

    @GET({ path: "/hands/latest" })
    @AuthServ.authGamePlayer()
    async getLatestHands(@CurrentGame() game: Game) {
        return game.hand?.persistJSON()
    }

    @GET({ path: "/hands" })
    @AuthServ.authPlayer()
    @AuthServ.authGame()
    async getHands(@PlayerId() playerId: string, @CurrentGame() game: Game, @Query() query: any) {
        const pageSize = isNaN(query.pageSize) ? 10 : parseInt(query.pageSize)
        const page = query.page ?? 0
        const offset = page * pageSize
        const data = await GameServ.HandModel.find({
            gameId: game.id
        }).limit(pageSize).project({logs: 0}).sort({ id: 'desc' }).skip(offset).toArray()
        data.forEach(h => {
            if (_.keys(h.playerNames).find(pid => !h.acceptShowSeeds?.includes?.(pid))) {
                delete h.privateSeed
            }
            h.yourCards = h.yourCards?.[playerId]
        })

        const total = await GameServ.HandModel.countDocuments({ gameId: game.id })
        return {
            data,
            total
        }
    }

    @GET({ path: "/hands/:handId" })
    @AuthServ.authPlayer()
    @AuthServ.authGame()
    async getHand(@PlayerId() playerId: string, @CurrentGame() game: Game, @IntParams('handId') handId: number) {
        const hand = await GameServ.HandModel.findOne({
            id: handId,
            gameId: game.id,
        })
        
        if (_.keys(hand.playerNames).find(pid => !hand.acceptShowSeeds?.includes?.(pid))) {
            delete hand.privateSeed
        }
        hand.yourCards = hand.yourCards?.[playerId]

        return hand
    }

    @POST({ path: "/sockets/:socketId" })
    @AuthServ.authPlayer()
    @AuthServ.authGame()
    async bindSocket(@PlayerId() playerId: string, @CurrentGame() game: Game, @Params('socketId') socketId: string) {
        GameServ.playerConnect(game, playerId, socketId)
        return HC.SUCCESS
    }
}

export default new GamesRouter()
