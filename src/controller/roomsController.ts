import socket from 'socket.io'
import { Game } from '../entities/Game'
import { GameState } from '../types/game'

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

	public getRooms=() => {
		const mapRooms = RoomsController.globalState

		const rooms = [{}]

		mapRooms.forEach((value, key) => {
			rooms.push({ name: key, players: value.players.length })
		})

		rooms.shift()

		return rooms
	}

	public getPlayers = () => {
		const roomName = RoomsController.clientRooms.get(this.client.id)
		if (!roomName) {
			return
		}

		const state = RoomsController.globalState.get(roomName) || {} as GameState

		const players = [{}]

		state.players.forEach(player => {
			players.push(player.name)
		})

		players.shift()
		return players
	}

  public handleNewGame = (roomName) => {
  	const room = this.server.sockets.adapter.rooms.has(roomName)

  	if (room) {
  		this.client.emit('roomExists')
  		return
  	}

  	RoomsController.clientRooms.set(this.client.id, roomName)
  	this.client.emit('gameCode', roomName)

  	RoomsController.globalState.set(roomName, new Game().initGame())

  	this.client.broadcast.emit('newRoom', JSON.stringify(this.getRooms()))
  	this.client.emit('goLobby', roomName)

  	this.client.join(roomName)
  	this.client.data.playerId = 1
  	this.client.emit('init', 1)

  	this.client.emit('newPlayer', JSON.stringify(this.getPlayers()))
  }

	public handleJoinGame= (roomName) => {
		const room = this.server.sockets.adapter.rooms.get(roomName)

		let numClients = 0
		if (room) {
			numClients = room.size
			console.log(numClients)
		}

		if (numClients === 0) {
			this.client.emit('unknownCode')
			return
		} else if (numClients > 3) {
			this.client.emit('tooManyPlayers')
			return
		}

		RoomsController.clientRooms.set(this.client.id, roomName)

		this.client.join(roomName)
		this.client.data.playerId = numClients + 1
		this.client.emit('init', numClients + 1)

		const state = RoomsController.globalState.get(roomName) || {} as GameState

		state.players.push({ cards: [], name: `player${numClients + 1}` })
		RoomsController.globalState.set(roomName, state)

		this.client.emit('goLobby', roomName)
		this.server.sockets.in(roomName).emit('newPlayer', JSON.stringify(this.getPlayers()))

		if (numClients === 3) {
			this.startGameInterval(roomName)
		}
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
