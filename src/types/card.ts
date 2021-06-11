/* eslint-disable no-unused-vars */
export interface ICard {
  type: ICardType
  color?: ICardColor
  number?: number
}

export enum ICardType {
	NUMBER = 'number',
  REVERSE = 'reverse',
  SKIPPED= 'skipped',
  DRAW_TWO = 'draw_two',
  JOKER = 'joker',
  JOKER_DRAW = 'joker_drawFour'
}

export enum ICardColor {
  YELLOW = 'yellow',
  GREEN = 'green',
  RED = 'red',
  BLUE = 'blue',
  BLACK = 'black'
}
