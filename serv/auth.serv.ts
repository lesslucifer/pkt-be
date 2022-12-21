import express = require('express');
import { addMiddlewareDecor, ExpressRouter } from "express-router-ts";
import hera, { AppLogicError } from '../utils/hera';
import GameServ from './game.serv';

export class AuthServ {
    static authPlayer() {
        return addMiddlewareDecor(async (req: express.Request) => {
            if (!req.session.playerId) {
                const playerId = req.header('x-player-id');
                if (hera.isEmpty(playerId)) throw ExpressRouter.NEXT; // new AppLogicError(`Unauthorized, Invalid access token`, 403);

                req.session.playerId =  playerId
            }
        });

    }

    static authGame() {
        return addMiddlewareDecor(async (req: express.Request) => {
            if (!req.session.game) {
                const gameId = req.header('x-game-id')
                if (hera.isEmpty(gameId)) throw ExpressRouter.NEXT; // new AppLogicError(`Unauthorized, Invalid access token`, 403);

                const game = GameServ.games.get(gameId)
                if (!game) throw new AppLogicError(`Cannot find game ${gameId}`, 404)
            
                req.session.game =  game
            }
        });

    }

    static authGamePlayer() {
        return addMiddlewareDecor(async (req: express.Request) => {
            if (!req.session.playerId) {
                const playerId = req.header('x-player-id');
                if (hera.isEmpty(playerId)) throw ExpressRouter.NEXT; // new AppLogicError(`Unauthorized, Invalid access token`, 403);

                const gameId = req.header('x-game-id')
                if (hera.isEmpty(gameId)) throw ExpressRouter.NEXT; // new AppLogicError(`Unauthorized, Invalid access token`, 403);
                
                const game = GameServ.games.get(gameId)
                if (!game) throw new AppLogicError(`Cannot find game ${gameId}`, 404)

                const gp = game.players.get(playerId)
                if (!gp) throw new AppLogicError(`User did not join the game`, 400)

                req.session.playerId =  playerId
                req.session.game = game
                req.session.gamePlayer = gp
            }
        });
    }
}

export default AuthServ;
