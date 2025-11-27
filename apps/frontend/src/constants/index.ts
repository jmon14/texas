import { green, lightBlue, orange, red } from '@mui/material/colors';
import { ActionDtoTypeEnum, HandRangeDto } from '../../backend-api/api';

// Enums
export enum FetchStatus {
  IDDLE = 'iddle',
  LOADING = 'loading',
  SUCCEDED = 'succeded',
  FAILED = 'failed',
}

// Dimensions
export const drawerWidth = 240;

// Regex
export const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{6,20}$/;
export const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,20}$/;
export const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

type ActionColorType = {
  [key in ActionDtoTypeEnum]: string;
};

export const ActionColor: ActionColorType = {
  [ActionDtoTypeEnum.Fold]: green[300],
  [ActionDtoTypeEnum.Call]: lightBlue[800],
  [ActionDtoTypeEnum.Raise]: red[700],
  [ActionDtoTypeEnum.Check]: orange[500],
};

export enum CardSuitEnum {
  Spades = 'spades',
  Hearts = 'hearts',
  Diamonds = 'diamonds',
  Clubs = 'clubs',
}

export enum CardValueEnum {
  Ace = 'ace',
  King = 'king',
  Queen = 'queen',
  Jack = 'jack',
  Ten = 'ten',
  Nine = 'nine',
  Eight = 'eight',
  Seven = 'seven',
  Six = 'six',
  Five = 'five',
  Four = 'four',
  Three = 'three',
  Two = 'two',
}

type CardLabelType = {
  [key in CardValueEnum]: string;
};

export const CardLabel: CardLabelType = {
  [CardValueEnum.Ace]: 'A',
  [CardValueEnum.King]: 'K',
  [CardValueEnum.Queen]: 'Q',
  [CardValueEnum.Jack]: 'J',
  [CardValueEnum.Ten]: 'T',
  [CardValueEnum.Nine]: '9',
  [CardValueEnum.Eight]: '8',
  [CardValueEnum.Seven]: '7',
  [CardValueEnum.Six]: '6',
  [CardValueEnum.Five]: '5',
  [CardValueEnum.Four]: '4',
  [CardValueEnum.Three]: '3',
  [CardValueEnum.Two]: '2',
};

export const defaultActions = [
  { type: ActionDtoTypeEnum.Fold, frequency: 50 },
  { type: ActionDtoTypeEnum.Call, frequency: 30 },
  { type: ActionDtoTypeEnum.Raise, frequency: 20 },
];

export const defaultHandRange: HandRangeDto[] = [
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'AA',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'AKs',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'AQs',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'AJs',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'ATs',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'A9s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'A8s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'A7s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'A6s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'A5s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'A4s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'A3s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'A2s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'AKo',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'KK',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'KQs',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'KJs',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'KTs',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'K9s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'K8s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'K7s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'K6s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'K5s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'K4s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'K3s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'K2s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'AQo',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'KQo',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'QQ',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'QJs',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'QTs',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'Q9s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'Q8s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'Q7s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'Q6s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'Q5s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'Q4s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'Q3s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'Q2s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'AJo',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'KJo',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'QJo',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'JJ',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'JTs',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'J9s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'J8s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'J7s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'J6s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'J5s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'J4s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'J3s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'J2s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'ATo',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'KTo',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'QTo',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'JTo',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'TT',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'T9s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'T8s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'T7s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'T6s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'T5s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'T4s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'T3s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'T2s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'A9o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'K9o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'Q9o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'J9o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'T9o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '99',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '98s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '97s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '96s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '95s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '94s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '93s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '92s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'A8o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'K8o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'Q8o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'J8o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'T8o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '98o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '88',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '87s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '86s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '85s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '84s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '83s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '82s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'A7o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'K7o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'Q7o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'J7o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'T7o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '97o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '87o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '77',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '76s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '75s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '74s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '73s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '72s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'A6o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'K6o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'Q6o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'J6o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'T6o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '96o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '86o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '76o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '66',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '65s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '64s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '63s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '62s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'A5o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'K5o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'Q5o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'J5o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'T5o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '95o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '85o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '75o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '65o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '55',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '54s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '53s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '52s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'A4o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'K4o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'Q4o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'J4o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'T4o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '94o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '84o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '74o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '64o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '54o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '44',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '43s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '42s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'A3o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'K3o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'Q3o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'J3o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'T3o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '93o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '83o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '73o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '63o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '53o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '43o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '33',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '32s',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'A2o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'K2o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'Q2o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'J2o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: 'T2o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '92o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '82o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '72o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '62o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '52o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '42o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '32o',
  },
  {
    carryoverFrequency: 100,
    actions: [],
    label: '22',
  },
];
