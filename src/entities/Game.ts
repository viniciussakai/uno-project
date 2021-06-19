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
			players: [{ cards: [] }, { cards: [] }, { cards: [] }, { cards: [] }],
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

	const deck = new Deck(state.gameDeck, state.playDeck)

	state.gameDeck = deck.getDeck()
	state.playDeck = deck.getPlayDeck()

	return false
}
}
