import { green, lightBlue, orange, red } from '@mui/material/colors';
import { ActionTypeEnum, HandRange } from '../../vision-api';

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
  [key in ActionTypeEnum]: string;
};

export const ActionColor: ActionColorType = {
  [ActionTypeEnum.Fold]: green[300],
  [ActionTypeEnum.Call]: lightBlue[800],
  [ActionTypeEnum.Raise]: red[700],
  [ActionTypeEnum.Check]: orange[500],
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

export const defaultHandRange: HandRange[] = [
  {
    rangeFraction: 1,
    actions: [],
    label: 'AA',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'AKs',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'AQs',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'AJs',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'ATs',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'A9s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'A8s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'A7s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'A6s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'A5s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'A4s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'A3s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'A2s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'AKo',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'KK',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'KQs',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'KJs',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'KTs',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'K9s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'K8s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'K7s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'K6s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'K5s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'K4s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'K3s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'K2s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'AQo',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'KQo',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'QQ',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'QJs',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'QTs',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'Q9s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'Q8s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'Q7s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'Q6s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'Q5s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'Q4s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'Q3s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'Q2s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'AJo',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'KJo',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'QJo',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'JJ',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'JTs',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'J9s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'J8s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'J7s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'J6s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'J5s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'J4s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'J3s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'J2s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'ATo',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'KTo',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'QTo',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'JTo',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'TT',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'T9s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'T8s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'T7s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'T6s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'T5s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'T4s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'T3s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'T2s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'A9o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'K9o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'Q9o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'J9o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'T9o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '99',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '98s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '97s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '96s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '95s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '94s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '93s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '92s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'A8o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'K8o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'Q8o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'J8o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'T8o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '98o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '88',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '87s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '86s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '85s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '84s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '83s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '82s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'A7o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'K7o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'Q7o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'J7o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'T7o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '97o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '87o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '77',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '76s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '75s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '74s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '73s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '72s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'A6o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'K6o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'Q6o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'J6o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'T6o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '96o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '86o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '76o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '66',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '65s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '64s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '63s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '62s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'A5o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'K5o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'Q5o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'J5o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'T5o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '95o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '85o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '75o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '65o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '55',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '54s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '53s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '52s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'A4o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'K4o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'Q4o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'J4o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'T4o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '94o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '84o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '74o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '64o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '54o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '44',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '43s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '42s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'A3o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'K3o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'Q3o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'J3o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'T3o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '93o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '83o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '73o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '63o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '53o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '43o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '33',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '32s',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'A2o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'K2o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'Q2o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'J2o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: 'T2o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '92o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '82o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '72o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '62o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '52o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '42o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '32o',
  },
  {
    rangeFraction: 1,
    actions: [],
    label: '22',
  },
];
