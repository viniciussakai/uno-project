import socket from 'socket.io'
import { RoomsController } from './roomsController'

class SocketController {
	private io : socket.Server;

	public init (io) {
		this.io = io
		this.io.on('connection', (client) => {
			const room = new RoomsController(client, this.io)

			console.log(`[client] A new user connected: ${client.id}`)

			client.emit('ready')

			client.on('join', (roomName) => {
				room.handleJoinGame(roomName)
				client.broadcast.emit('new room', roomName)
			})

			client.on('newGame', () => {
				room.handleNewGame()
			})
		})
	}
}

export default new SocketController()
