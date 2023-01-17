import express = require('express');
import { addMiddlewareDecor, ExpressRouter } from "express-router-ts";
import ENV from '../glob/env';
import { IAuthUser, JWTAuth } from '../utils/auth';
import hera, { AppLogicError } from '../utils/hera';
import GameServ from './game.serv';

export class AuthServ {
    static authenticator = new JWTAuth(ENV.JWT_AUTH, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)

    static authPlayer() {
        return addMiddlewareDecor(async (req: express.Request) => {
            if (!req.session.playerId) {
                const token = req.header('Authorization');
                if (!token) throw ExpressRouter.NEXT;

                let user: IAuthUser
                try {
                    user = await this.authenticator.getUser(token)
                }
                catch (err) {
                    throw new AppLogicError(err?.message ?? 'Authorization error', 401)
                }

                if (hera.isEmpty(user?.id)) throw ExpressRouter.NEXT;

                req.session.playerId =  user.id as string
            }
        });

    }

    static authGame() {
        return addMiddlewareDecor(async (req: express.Request) => {
            if (!req.session.game) {
                const gameId = req.header('x-game-id')
                if (hera.isEmpty(gameId)) throw ExpressRouter.NEXT; // new AppLogicError(`Unauthorized, Invalid access token`, 403);

                const game = await GameServ.getGame(gameId)
                if (!game) throw new AppLogicError(`Cannot find game ${gameId}`, 404)
            
                req.session.game =  game
            }
        });

    }

    static authGamePlayer() {
        return addMiddlewareDecor(async (req: express.Request) => {
            if (!req.session.playerId) {
                const token = req.header('Authorization');
                if (!token) throw ExpressRouter.NEXT;

                const user = await this.authenticator.getUser(token)
                if (hera.isEmpty(user?.id)) throw ExpressRouter.NEXT;

                const gameId = req.header('x-game-id')
                if (hera.isEmpty(gameId)) throw ExpressRouter.NEXT; // new AppLogicError(`Unauthorized, Invalid access token`, 403);
                
                const game = await GameServ.getGame(gameId)
                if (!game) throw new AppLogicError(`Cannot find game ${gameId}`, 404)

                const gp = game.players.get(user.id as string)
                if (!gp) throw new AppLogicError(`User is not in the game`, 400)

                req.session.playerId =  user.id as string
                req.session.game = game
                req.session.gamePlayer = gp
            }
        });
    }
}

export default AuthServ;
