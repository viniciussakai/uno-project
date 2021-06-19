/* eslint-disable no-unused-vars */
import { Deck } from '../entities/Deck'
import { ICard, ICardColor } from './card'
import { Player } from './players'

export interface GameState{
	players: Player[];
	flow: Flow;
	playerAtive: number;
	gameDeck: ICard[];
	playDeck: ICard[];

	sendCard?: {
		card: ICard;
		playersId: string
	};

	sendColor?:{
		color: ICardColor
	}

	unoButton?: boolean
}

export enum Flow{
	LEFT = 'left',
	RIGHT = 'right'
}
