import * as http from 'http';
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

type SocketIOConnection =  Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>

export class RealtimeService {
    io: Server
    sockets = new Map<string, SocketIOConnection>()
    binding = new Map<string, Set<string>>()

    init(server: http.Server) {
        this.io = new Server(server, {
            cors: {
                origin: '*'
            }
        })

        this.io.on('connection', (socket) => {
            this.setupNewConnection(socket)
        })
    }

    setupNewConnection(socket: SocketIOConnection) {
        this.sockets.set(socket.id, socket)

        socket.on('disconnect', (reason) => {
            this.sockets.delete(socket.id)
        })
    }

    bind(id: string, socketId: string) {
        if (!this.binding.has(id)) {
            this.binding.set(id, new Set())
        }
        this.binding.get(id).add(socketId)
    }

    getSocket(socketId: string) {
        if (!socketId) return null
        const socket = this.sockets.get(socketId)
        if (!socket || socket.disconnected) {
            this.sockets.delete(socketId)
            return null
        }
        return socket
    }

    getSocketsFromBinding(id: string) {
        const socketIds = this.binding.get(id)
        if (!socketIds || !socketIds.size) return []
        return [...socketIds].map(sid => this.getSocket(sid)).filter(s => !!s)
    }
}

export const RealtimeServ = new RealtimeService()
export default RealtimeServ
