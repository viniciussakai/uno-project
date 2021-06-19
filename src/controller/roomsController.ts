import socket from 'socket.io'
import { Game } from '../entities/Game'
import { GameState } from '../types/game'
import { makeid } from '../utils/randomString'

type GlobalStateMap= Map<string, GameState>;

export class RoomsController {
	private client: socket.Socket
	private server: socket.Server
	private static globalState:GlobalStateMap = new Map();
	private static clientRooms = new Map();

	public constructor (client, server) {
		this.client = client
		this.server = server
	}

  public handleNewGame = () => {
  	const roomName = makeid(5)

  	RoomsController.clientRooms.set(this.client.id, roomName)
  	this.client.emit('gameCode', roomName)

  	RoomsController.globalState.set(roomName, new Game().initGame())

  	this.client.join(roomName)
  	this.client.data.playerId = 1
  	this.client.emit('init', 1)
  }

	public handleJoinGame= (roomName) => {
		const room = this.server.sockets.adapter.rooms.get(roomName)

		let numClients = 0
		if (room) {
			numClients = room.size
		}

		if (numClients === 0) {
			this.client.emit('unknownCode')
			return
		} else if (numClients > 4) {
			this.client.emit('tooManyPlayers')
			return
		}

		RoomsController.clientRooms.set(this.client.id, roomName)

		this.client.join(roomName)
		this.client.data.playerId = numClients + 1
		this.client.emit('init', numClients + 1)

		this.startGameInterval(roomName)
	}

	public handleSendCard= (sendCard) => {
		const roomName = RoomsController.clientRooms.get(this.client.id)
		if (!roomName) {
			return
		}
		try {
			sendCard = JSON.parse(sendCard)
		} catch (e) {
			console.error(e)
			return
		}

		const state = RoomsController.globalState.get(roomName) || {} as GameState
		state.sendCard = sendCard

		RoomsController.globalState.set(roomName, state)
	}

	private startGameInterval (roomName) {
		const intervalId = setInterval(() => {
			const roomState = RoomsController.globalState.get(roomName)

			const winner = Game.gameLoop(roomState)

			if (!winner) {
				this.emitGameState(roomName, roomState)
			} else {
				this.emitGameOver(roomName, winner)
				RoomsController.globalState.delete(roomName)
				clearInterval(intervalId)
			}
		}, 1000 / 2)
	}

	private emitGameState = (room, gameState) => {
		this.server.sockets.in(room)
			.emit('gameState', JSON.stringify(gameState))
	}

	private emitGameOver = (room, winner) => {
		this.server.sockets.in(room)
			.emit('gameOver', JSON.stringify({ winner }))
	}
}
