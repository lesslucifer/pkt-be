import { GameSettings } from "./game";

export enum GameLogAction {
    GAME_INIT = 'GI',
    REQUEST_SEAT_IN = 'RS_I',
    REQUEST_SEAT_OUT = 'RS_O',
    REQUEST_UNSEAT_OUT = 'RS_UO',
    SEAT_IN = 'SI',
    SEAT_OUT = 'SO',
    REQUEST_STACK_ADD = 'RST_A',
    REQUEST_STACK_SET = 'RST_S',
    STACK_ADD = 'ST_A',
    STACK_SET = 'ST_S',
    NEW_HAND = 'NH',
    GAME_STOP = 'GS',
    HAND_OVER = 'HO',
    REQUEST_UPDATE_SETTINGS = 'RUS',
    UPDATE_SETTINGS = 'US',
    TRANSFER_OWNERSHIP = 'TO',
    SHUFFLE_SEATS = 'SHS',
    START_GAME = 'STRG',
    REQUEST_STOP_GAME = 'RSTPG',
    REQUEST_UNSTOP_GAME = 'RUSTPG',
    PAUSE_GAME = 'PSG',
    RESUME_GAME = 'RSG',
    SOCKET_IN = 'SK_I',
    SOCKET_OUT = 'SK_O'
}

export const PersistedLogActions: Set<GameLogAction> = new Set([GameLogAction.GAME_INIT, GameLogAction.SEAT_IN, GameLogAction.SEAT_OUT,
    GameLogAction.STACK_ADD, GameLogAction.STACK_SET, GameLogAction.NEW_HAND, , GameLogAction.GAME_STOP,
    GameLogAction.HAND_OVER, GameLogAction.UPDATE_SETTINGS, GameLogAction.TRANSFER_OWNERSHIP, GameLogAction.SHUFFLE_SEATS,
    GameLogAction.START_GAME, GameLogAction.PAUSE_GAME, GameLogAction.RESUME_GAME
])

export interface IGameLog {
    action: GameLogAction
    time?: number
    player?: string
    owner?: string
    stack?: number
    buyIn?: number
    buyOut?: number
    name?: string
    seat?: number
    amount?: number
    handId?: number
    settings?: GameSettings
    seats?: string[]
}

export function gameLogUpdateFields(action: GameLogAction): string[] {
    switch (action) {
        case GameLogAction.GAME_INIT:
        case GameLogAction.NEW_HAND:
        case GameLogAction.HAND_OVER:
        case GameLogAction.GAME_STOP:
        case GameLogAction.START_GAME:
        case GameLogAction.SOCKET_IN:
        case GameLogAction.RESUME_GAME:
            return ['*']

        case GameLogAction.REQUEST_SEAT_IN:
            return ['requests', 'players']

        case GameLogAction.REQUEST_SEAT_OUT:
        case GameLogAction.REQUEST_UNSEAT_OUT:
        case GameLogAction.REQUEST_SEAT_OUT:
        case GameLogAction.REQUEST_UPDATE_SETTINGS:
        case GameLogAction.REQUEST_STOP_GAME:
        case GameLogAction.REQUEST_UNSTOP_GAME:
            return ['requests']

        case GameLogAction.SEAT_IN:
        case GameLogAction.SEAT_OUT:
            return ['players', 'seats', 'dealerSeat']

        case GameLogAction.STACK_ADD:
        case GameLogAction.STACK_SET:
            return ['players']
        
        case GameLogAction.PAUSE_GAME:
            return ['status', 'dealerSeat']
        
        case GameLogAction.UPDATE_SETTINGS:
            return ['settings']
        
        case GameLogAction.TRANSFER_OWNERSHIP:
            return ['ownerId']
        
        case GameLogAction.SHUFFLE_SEATS:
            return ['seats', 'dealerSeat']
        
        case GameLogAction.SOCKET_OUT:
            return ['onlinePlayers']
    }
    return ['*']
}