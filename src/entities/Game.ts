import { ICardType } from '../types/card'
import { Flow, GameState } from '../types/game'
import { Deck } from './Deck'

export class Game {
	public initGame = () => {
		const state = this.createGameState()
		return state
	}

	public createGameState = () => {
		const deck = new Deck()

		const gameState: GameState = {
			players: [{ cards: [], name: 'player1' }],
			flow: Flow.LEFT,
			playerAtive: 1,
			gameDeck: deck.getDeck(),
			playDeck: deck.getPlayDeck()
		}

		return gameState
	}

public static gameLoop = (state?: GameState) => {
	if (!state) {
		return
	}

	const nextPlayer = () => {
		const player = state.playerAtive
		const isLeft = state.flow === 'left'

		if (player === 3) {
			state.playerAtive = isLeft ? 0 : 2
			return
		}

		if (player === 0) {
			state.playerAtive = isLeft ? 0 : 2
			return
		}

		isLeft ? state.playerAtive++ : state.playerAtive--
	}

	const deck = new Deck(state.gameDeck, state.playDeck)

	const { sendCard, playerAtive } = state
	const lastCard = deck.getLastCard()

	if (sendCard === undefined) {
		return
	}

	const isSameColor = sendCard.card.color === lastCard.color
	const isSameNumber = sendCard.card.number === lastCard.number
	const isSameType = sendCard.card.type !== ICardType.NUMBER

	if (isSameColor || isSameNumber || isSameType) {
		deck.dropCard(state.players[playerAtive], sendCard.card)
	}

	state.gameDeck = deck.getDeck()
	state.playDeck = deck.getPlayDeck()
	nextPlayer()

	return false
}
}
