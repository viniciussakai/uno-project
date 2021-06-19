import { ICard, ICardType, ICardColor } from '../types/card'
import { Player } from '../types/players'
import { shuffleArray } from '../utils/shuffle'
import { randomNumber } from '../utils/randomNumber'
import { GameState } from '../types/game'

export class Deck {
	private gameDeck: ICard[] = [];
	private playDeck: ICard[] = [];

	public constructor (gameDeck?:ICard[], playDeck?:ICard[]) {
		if (this.gameDeck.length === 0) {
			this.createDeck()
			this.suffleDeck()
			this.generatePlayDeck()
		} else {
			this.gameDeck = gameDeck || []
			this.playDeck = playDeck || []
		}
	}

	private createDeck () {
		const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
		const colors = [ICardColor.YELLOW, ICardColor.BLUE, ICardColor.GREEN, ICardColor.RED]
		const typesColor = [ICardType.DRAW_TWO, ICardType.REVERSE, ICardType.SKIPPED]
		const typesJoker = [ICardType.JOKER, ICardType.JOKER_DRAW]

		for (let contador = 1; contador <= 2; contador++) {
			colors.forEach((color) => {
				numbers.forEach((number) => {
					this.addCardGameDeck({ type: ICardType.NUMBER, number, color })
				})

				typesColor.forEach((type) => {
					this.addCardGameDeck({ type: type, color })
				})
			})
			typesJoker.forEach((type) => {
				this.addCardGameDeck({ type })
				this.addCardGameDeck({ type })
			})
		}

		colors.forEach((color) => {
			this.addCardGameDeck({ type: ICardType.NUMBER, number: 0, color })
		})
	}

	private suffleDeck = () => {
		shuffleArray(this.gameDeck)
	}

	private generatePlayDeck = () => {
		let card = this.getRandomCard()

		while (card.type !== ICardType.NUMBER) {
			card = this.getRandomCard()
		}

		const cardIndex = this.gameDeck.findIndex((cardItem) => {
		 return	cardItem === card
		})

		this.playDeck = this.gameDeck.splice(cardIndex, 1)
	}

	private getRandomCard = () => {
		const random = randomNumber(this.gameDeck.length)
		return this.gameDeck[random]
	}

	public addCardGameDeck = (card: ICard) => {
		this.gameDeck.push(card)
	}

	public dealCards = (state: GameState) => {
		const players = state.players
		players.forEach(player => {
			player.cards = this.gameDeck.splice(0, 7)
		})
	}

	public dropCard = (player: Player, sendCard: ICard) => {
		const cardIndex = player.cards.findIndex((card) => {
			return card === sendCard
		})

		const card = player.cards.splice(cardIndex, 1)
		this.playDeck.push(card[0])
	}

	public getLastCard = () => {
		return this.playDeck[this.playDeck.length - 1]
	}

	public getPlayDeck = () => {
		return this.playDeck
	}

	public getDeck = () => {
		return this.gameDeck
	}
}
