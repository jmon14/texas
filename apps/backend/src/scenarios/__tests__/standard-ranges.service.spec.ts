// NestJS
import { Test } from '@nestjs/testing';
import { StandardRangesService } from '../standard-ranges.service';
import { Position } from '../enums/position.enum';

describe('StandardRangesService', () => {
  let service: StandardRangesService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [StandardRangesService],
    }).compile();

    service = module.get<StandardRangesService>(StandardRangesService);
  });

  describe('getOpeningRange', () => {
    it('should return opening range for UTG', () => {
      const range = service.getOpeningRange(Position.UTG);
      expect(range).toBeDefined();
      expect(typeof range).toBe('string');
      expect(range.length).toBeGreaterThan(0);
      // UTG should have a tight range (includes premium hands)
      expect(range).toContain('AA');
      expect(range).toContain('KK');
    });

    it('should return opening range for MP', () => {
      const range = service.getOpeningRange(Position.MP);
      expect(range).toBeDefined();
      expect(typeof range).toBe('string');
      expect(range.length).toBeGreaterThan(0);
    });

    it('should return opening range for CO', () => {
      const range = service.getOpeningRange(Position.CO);
      expect(range).toBeDefined();
      expect(typeof range).toBe('string');
      expect(range.length).toBeGreaterThan(0);
    });

    it('should return opening range for BTN', () => {
      const range = service.getOpeningRange(Position.BTN);
      expect(range).toBeDefined();
      expect(typeof range).toBe('string');
      expect(range.length).toBeGreaterThan(0);
      // BTN should have the widest range
      expect(range.length).toBeGreaterThan(service.getOpeningRange(Position.UTG).length);
    });

    it('should return opening range for SB', () => {
      const range = service.getOpeningRange(Position.SB);
      expect(range).toBeDefined();
      expect(typeof range).toBe('string');
      expect(range.length).toBeGreaterThan(0);
    });

    it('should throw error for BB position', () => {
      expect(() => service.getOpeningRange(Position.BB)).toThrow(
        'BB position does not have an opening range',
      );
    });

    it('should throw error for unknown position', () => {
      expect(() => service.getOpeningRange('UNKNOWN' as Position)).toThrow('Unknown position');
    });
  });

  describe('getDefendingRange', () => {
    it('should return defending range for BB', () => {
      const range = service.getDefendingRange(Position.BB, Position.UTG);
      expect(range).toBeDefined();
      expect(typeof range).toBe('string');
      expect(range.length).toBeGreaterThan(0);
    });

    it('should return defending range for SB', () => {
      const range = service.getDefendingRange(Position.SB, Position.BTN);
      expect(range).toBeDefined();
      expect(typeof range).toBe('string');
      expect(range.length).toBeGreaterThan(0);
    });

    it('should return defending range for BTN', () => {
      const range = service.getDefendingRange(Position.BTN, Position.CO);
      expect(range).toBeDefined();
      expect(typeof range).toBe('string');
      expect(range.length).toBeGreaterThan(0);
    });

    it('should return defending range for CO', () => {
      const range = service.getDefendingRange(Position.CO, Position.MP);
      expect(range).toBeDefined();
      expect(typeof range).toBe('string');
      expect(range.length).toBeGreaterThan(0);
    });

    it('should return defending range for MP', () => {
      const range = service.getDefendingRange(Position.MP, Position.UTG);
      expect(range).toBeDefined();
      expect(typeof range).toBe('string');
      expect(range.length).toBeGreaterThan(0);
    });

    it('should throw error for UTG position', () => {
      expect(() => service.getDefendingRange(Position.UTG, Position.BB)).toThrow(
        'UTG position cannot defend vs an opener',
      );
    });

    it('should throw error for unknown position', () => {
      expect(() => service.getDefendingRange('UNKNOWN' as Position, Position.BTN)).toThrow(
        'Unknown position for defending range',
      );
    });
  });

  describe('getThreeBettingRange', () => {
    it('should return 3-betting range for UTG', () => {
      const range = service.getThreeBettingRange(Position.UTG, Position.BB);
      expect(range).toBeDefined();
      expect(typeof range).toBe('string');
      expect(range.length).toBeGreaterThan(0);
    });

    it('should return 3-betting range for MP', () => {
      const range = service.getThreeBettingRange(Position.MP, Position.UTG);
      expect(range).toBeDefined();
      expect(typeof range).toBe('string');
      expect(range.length).toBeGreaterThan(0);
    });

    it('should return 3-betting range for CO', () => {
      const range = service.getThreeBettingRange(Position.CO, Position.MP);
      expect(range).toBeDefined();
      expect(typeof range).toBe('string');
      expect(range.length).toBeGreaterThan(0);
    });

    it('should return 3-betting range for BTN', () => {
      const range = service.getThreeBettingRange(Position.BTN, Position.CO);
      expect(range).toBeDefined();
      expect(typeof range).toBe('string');
      expect(range.length).toBeGreaterThan(0);
    });

    it('should return 3-betting range for SB', () => {
      const range = service.getThreeBettingRange(Position.SB, Position.BTN);
      expect(range).toBeDefined();
      expect(typeof range).toBe('string');
      expect(range.length).toBeGreaterThan(0);
    });

    it('should return 3-betting range for BB', () => {
      const range = service.getThreeBettingRange(Position.BB, Position.BTN);
      expect(range).toBeDefined();
      expect(typeof range).toBe('string');
      expect(range.length).toBeGreaterThan(0);
    });

    it('should throw error for unknown position', () => {
      expect(() => service.getThreeBettingRange('UNKNOWN' as Position, Position.BTN)).toThrow(
        'Unknown position for 3-betting range',
      );
    });
  });
});
