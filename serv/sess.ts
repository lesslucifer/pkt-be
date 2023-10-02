import * as express from 'express';
import * as uuid from 'uuid';
import { GamePlayer, HoldemPokerGame } from '../models/holdem/game';

export class AuthUserSession {
    constructor(public id: string, public roles: string[]) {}
}

interface IReqSession {
    playerId?: string;
    gamePlayer?: GamePlayer;
    game?: HoldemPokerGame;
    user?: AuthUserSession;
    system?: string;
}

declare module "express-serve-static-core" {
    interface Request {
        nonce: string;
        session: IReqSession
    }
}

export default function createSesssionObject(): express.RequestHandler {
    return (req, resp, next) => {
        req.session = {};
        req.nonce = uuid.v4();
        next();
    };
}

