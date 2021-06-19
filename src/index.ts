import app from './server'
import cors from 'cors'
import http from 'http'
import SocketServer from './utils/socket'
import socketController from './controller/socketController'
import { instrument } from '@socket.io/admin-ui'

const port = process.env.PORT || 3000
const server = http.createServer(app)

app.use(cors({ origin: 'http://localhost:3001/' }))

app.get('/', (req, res) => {
	return res.send({ name: '' })
})

const socket = SocketServer.setSocket(server)
const io = socket.getSocket()

instrument(io, {
	auth: false
})

socketController.init(io)

server.listen(port, () =>
	console.log(`[server] Running on port ${port}`))
