/* eslint-disable no-unused-vars */
import { ICard, ICardColor } from './card'
import { Player } from './players'

export interface GameState{
	players: Player[];
	flow: Flow;
	playerAtive: number;

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
