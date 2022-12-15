import { Game, GamePlayer } from "../models/game";
import shortid from 'shortid';
import fs = require('fs-extra')
import moment from "moment";

export class GameService {
    games = new Map<string, Game>()

    newGame(playerId: string) {
        const game = new Game(shortid.generate(), playerId)
        this.games.set(game.id, game)
        return game
    }

    save() {
        const data = [...this.games.values()].map(g => ({
            id: g.id,
            ownerId: g.ownerId,
            status: g.status,
            seats: g.seats.map(s => s && s.id),
            players: g.players,
            dealerSeat: g.dealerSeat,
            lastActive: g.lastActive
        }))
        fs.writeFileSync('data/games.json', JSON.stringify(data))
        console.log('Game saved at', moment().format('YYMMDD HH:mm:ss'))
    }

    load() {
        this.games.clear()
        try {
            const data = fs.readFileSync('data/games.json')
            const json = JSON.parse(data.toString())
            const games: Game[] = json.map(js => {
                const game = new Game(js.id, js.ownerId)
                Object.assign(game, js)
                game.players = js.players.map(p => Object.assign(new GamePlayer(p.id, game), p))
                game.seats = js.seats.map(s => s && game.players.find(p => p.id === s))
                return game
            })
    
            games.forEach(g => this.games.set(g.id, g))
        }
        catch (err) {
            console.log(err)
        }
    }

    startup() {
        this.load()
        setInterval(() => {
            try {
                this.save()
            }
            catch (err) {
                console.log(`Save game error`, err)
            }
        }, 60000)
    }
}

export const GameServ = new GameService()
export default GameServ