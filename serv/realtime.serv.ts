import * as http from 'http';
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

type SocketIOConnection =  Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>

export class RealtimeService {
    io: Server
    sockets = new Map<string, SocketIOConnection>()
    binding = new Map<string, Set<string>>()
    revBinding = new Map<string, Set<string>>()

    onSocketDisconnected?: (socketId: string, bindingIds: Set<string>) => void

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
            this.tearDownSocket(socket.id)
        })
    }

    private tearDownSocket(socketId: string) {
        const bindings = this.revBinding.get(socketId)
        this.revBinding.delete(socketId)
        this.sockets.delete(socketId)
        bindings?.forEach(id => this.binding.get(id)?.delete(socketId))

        try {
            this.onSocketDisconnected?.(socketId, bindings)
        }
        catch (err) {
            console.log(`onSocketDisconnected: error`)
            console.log(err)
        }
    }

    bind(id: string, socketId: string) {
        if (!this.binding.has(id)) {
            this.binding.set(id, new Set())
        }
        this.binding.get(id).add(socketId)
        
        if (!this.revBinding.has(socketId)) {
            this.revBinding.set(socketId, new Set())
        }
        this.revBinding.get(socketId).add(id)
    }

    getSocket(socketId: string) {
        if (!socketId) return null
        const socket = this.sockets.get(socketId)
        if (!socket || socket.disconnected) {
            this.tearDownSocket(socket.id)
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
