import { Server as HttpServer } from 'http'
import { Server } from 'socket.io'

class SocketInstance {
	private static io: Server;

	public setSocket (httpServer: HttpServer) {
		SocketInstance.io = new Server(httpServer, {
			cors: {
				origin: ['*:*'],
				methods: ['GET', 'POST']
			}
		})

		return this
	}

	public getSocket () {
	 return SocketInstance.io
	}
}

export default new SocketInstance()
