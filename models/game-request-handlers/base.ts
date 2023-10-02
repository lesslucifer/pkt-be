import Ajv, { ValidateFunction } from "ajv";
import * as ajv2 from "../../utils/ajv2";
import { AppLogicError } from "../../utils/hera";
import { HoldemPokerGame } from "../holdem/game";

const ajv = new Ajv();

export interface IGameRequestHandler {
    type: string
    handle(game: HoldemPokerGame, playerId: string, request: any): Promise<void>
}

export abstract class BaseGameRequestHandler<T = any> implements IGameRequestHandler {
    readonly type: string;
    readonly schema: any
    reqValidator: ValidateFunction

    constructor() {
        this.reqValidator = ajv.compile(ajv2.craft(this.schema))
    }

    handle(game: HoldemPokerGame, playerId: string, request: any) {
        if (!this.reqValidator(request)) throw new AppLogicError('Invalid request body!', 400, this.reqValidator.errors);
        return this.process(game, playerId, request)
    }

    async process(game: HoldemPokerGame, playerId: string, request: T) {}
}