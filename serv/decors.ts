import { argMapperDecor } from "express-router-ts";
import _ from "lodash";
import { AppLogicError } from "../utils/hera";

export function Player() {
    return argMapperDecor(req => req.session.playerId)
}

export function CurrentGame() {
    return argMapperDecor(req => req.session.playerId)
}

export function CurrentPlayer() {
    return argMapperDecor(req => req.session.gamePlayer)
}

export function IntParams(param: string) {
    return argMapperDecor(req => {
        const val = Number(req.params[param])
        if (!_.isNaN(val)) throw new AppLogicError(`Param ${param} must be integer, found ${val}`)
        return val
    })
}