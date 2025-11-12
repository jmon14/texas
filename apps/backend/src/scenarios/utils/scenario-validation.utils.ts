import { BadRequestException } from '@nestjs/common';
import { CreateScenarioDto } from '../dtos/create-scenario.dto';
import { Street } from '../enums/street.enum';

// Validation helpers using arrow functions (modern TypeScript)
export const isPostFlop = (street: Street): boolean => street !== Street.PREFLOP;

export const validateBoardCardsFormat = (boardCards: string): boolean => {
  const boardCardsRegex = /^([A2-9TJQK][hscd]\s?){3,5}$/;
  return boardCardsRegex.test(boardCards.trim());
};

export const validatePostFlopScenario = (dto: CreateScenarioDto): void => {
  if (!isPostFlop(dto.street)) {
    return;
  }

  if (!dto.boardCards) {
    throw new BadRequestException('boardCards is required for post-flop scenarios');
  }

  if (!validateBoardCardsFormat(dto.boardCards)) {
    throw new BadRequestException(
      'boardCards must be in format "As Kh 7d" with 3-5 cards for post-flop scenarios',
    );
  }

  if (!dto.boardTexture) {
    throw new BadRequestException('boardTexture is required for post-flop scenarios');
  }
};
