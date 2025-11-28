import { Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { TexasSolverService } from '../texas-solver.service';
import { ActionType } from '../enums/action-type.enum';
import { PlayerPosition } from '../enums/player-position.enum';
import { ConfigurationService } from '../../config/configuration.service';
import * as fs from 'fs/promises';

// Mock dependencies - must be done before service import
jest.mock('fs/promises');
jest.mock('child_process');

// Mock execFileAsync function
// Using a global variable because jest.mock is hoisted and runs before module-level variables
// This allows us to access the mock function in tests for assertions
declare global {
  // eslint-disable-next-line no-var
  var mockExecFileAsync: jest.Mock | undefined;
}

jest.mock('util', () => {
  // Create the mock function when the mock factory runs
  global.mockExecFileAsync = jest.fn().mockResolvedValue({ stdout: '', stderr: '' });

  return {
    promisify: jest.fn((fn: any) => {
      // Check if this is execFile - return our mock
      if (fn && typeof fn === 'function' && fn.toString().includes('execFile')) {
        return global.mockExecFileAsync;
      }
      // For any other function passed to promisify, return mock function
      return jest.fn().mockResolvedValue({ stdout: '', stderr: '' });
    }),
  };
});

describe('TexasSolverService', () => {
  let service: TexasSolverService;
  let mockWriteFile: jest.Mock;
  let mockReadFile: jest.Mock;
  let mockMkdir: jest.Mock;
  let mockAccess: jest.Mock;
  let mockExecFileAsyncFn: jest.Mock;
  let mockConfigurationService: jest.Mocked<ConfigurationService>;

  beforeEach(async () => {
    // Setup mocks
    mockWriteFile = jest.fn().mockResolvedValue(undefined);
    mockReadFile = jest.fn();
    mockMkdir = jest.fn().mockResolvedValue(undefined);
    mockAccess = jest.fn().mockResolvedValue(undefined);

    // Get the mock function instance (created by jest.mock above)
    mockExecFileAsyncFn = global.mockExecFileAsync!;

    // Reset execFileAsync mock
    mockExecFileAsyncFn.mockClear();
    mockExecFileAsyncFn.mockResolvedValue({ stdout: '', stderr: '' });

    // Mock ConfigurationService
    mockConfigurationService = {
      get: jest.fn().mockResolvedValue('development'),
    } as any;

    // Mock fs/promises
    jest.spyOn(fs, 'writeFile').mockImplementation(mockWriteFile);
    jest.spyOn(fs, 'readFile').mockImplementation(mockReadFile);
    jest.spyOn(fs, 'mkdir').mockImplementation(mockMkdir);
    jest.spyOn(fs, 'access').mockImplementation(mockAccess);

    // Mock Logger to avoid console output during tests
    jest.spyOn(Logger.prototype, 'log').mockImplementation();
    jest.spyOn(Logger.prototype, 'debug').mockImplementation();
    jest.spyOn(Logger.prototype, 'warn').mockImplementation();
    jest.spyOn(Logger.prototype, 'error').mockImplementation();

    const module = await Test.createTestingModule({
      providers: [
        TexasSolverService,
        {
          provide: ConfigurationService,
          useValue: mockConfigurationService,
        },
      ],
    }).compile();

    service = module.get<TexasSolverService>(TexasSolverService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('convertComboToPokerNotation', () => {
    it('should convert pairs correctly', () => {
      expect(service['convertComboToPokerNotation']('AdAc')).toBe('AA');
      expect(service['convertComboToPokerNotation']('KdKc')).toBe('KK');
      expect(service['convertComboToPokerNotation']('QhQc')).toBe('QQ');
      expect(service['convertComboToPokerNotation']('JdJc')).toBe('JJ');
      expect(service['convertComboToPokerNotation']('TdTc')).toBe('TT');
      expect(service['convertComboToPokerNotation']('9d9c')).toBe('99');
      expect(service['convertComboToPokerNotation']('8d8c')).toBe('88');
    });

    it('should convert suited hands correctly', () => {
      // Test AKs variants
      expect(service['convertComboToPokerNotation']('AcKc')).toBe('AKs');
      expect(service['convertComboToPokerNotation']('AdKd')).toBe('AKs');
      expect(service['convertComboToPokerNotation']('AhKh')).toBe('AKs');
      expect(service['convertComboToPokerNotation']('AsKs')).toBe('AKs');

      // Test lower suited hands
      expect(service['convertComboToPokerNotation']('QcJc')).toBe('QJs');
      expect(service['convertComboToPokerNotation']('JcTc')).toBe('JTs');
    });

    it('should convert offsuit hands correctly', () => {
      // Test AKo variants
      expect(service['convertComboToPokerNotation']('AcKd')).toBe('AKo');
      expect(service['convertComboToPokerNotation']('AcKh')).toBe('AKo');
      expect(service['convertComboToPokerNotation']('AdKc')).toBe('AKo');

      // Test lower offsuit hands
      expect(service['convertComboToPokerNotation']('QcJd')).toBe('QJo');
    });

    it('should handle rank ordering correctly', () => {
      // Higher rank first
      expect(service['convertComboToPokerNotation']('KcQc')).toBe('KQs');
      expect(service['convertComboToPokerNotation']('QcKc')).toBe('KQs'); // Should reorder

      // Ace high
      expect(service['convertComboToPokerNotation']('Ac2c')).toBe('A2s');
      expect(service['convertComboToPokerNotation']('2cAc')).toBe('A2s'); // Should reorder
    });

    it('should handle unexpected formats gracefully', () => {
      // Invalid length
      expect(service['convertComboToPokerNotation']('ABC')).toBe('ABC');
      expect(service['convertComboToPokerNotation']('AcKcXd')).toBe('AcKcXd');

      // Empty string
      expect(service['convertComboToPokerNotation']('')).toBe('');
    });
  });

  describe('averageFrequencies', () => {
    it('should return empty array for empty input', () => {
      expect(TexasSolverService['averageFrequencies']([])).toEqual([]);
    });

    it('should return single array unchanged', () => {
      expect(TexasSolverService['averageFrequencies']([[0.5, 0.5]])).toEqual([0.5, 0.5]);
    });

    it('should average multiple arrays of equal length', () => {
      const result = TexasSolverService['averageFrequencies']([
        [0.5, 0.5],
        [0.3, 0.7],
        [0.4, 0.6],
      ]);
      expect(result[0]).toBeCloseTo(0.4);
      expect(result[1]).toBeCloseTo(0.6);
    });

    it('should handle arrays of different lengths', () => {
      const result = TexasSolverService['averageFrequencies']([
        [0.5, 0.3, 0.2],
        [0.4, 0.6],
        [0.3, 0.5, 0.2, 0.0],
      ]);
      // Should average available positions, ignore missing
      expect(result.length).toBe(4);
      expect(result[0]).toBeCloseTo(0.4); // (0.5 + 0.4 + 0.3) / 3
      expect(result[1]).toBeCloseTo(0.466, 2); // (0.3 + 0.6 + 0.5) / 3
      expect(result[2]).toBeCloseTo(0.2); // (0.2 + 0.2) / 2
      expect(result[3]).toBeCloseTo(0.0); // (0.0) / 1
    });

    it('should handle zero frequencies correctly', () => {
      const result = TexasSolverService['averageFrequencies']([
        [0.0, 1.0],
        [0.0, 1.0],
        [0.0, 1.0],
      ]);
      expect(result).toEqual([0.0, 1.0]);
    });

    it('should handle mixed strategies', () => {
      const result = TexasSolverService['averageFrequencies']([
        [0.0, 0.5, 0.5], // 50% call, 50% raise
        [0.0, 0.3, 0.7], // 30% call, 70% raise
        [0.0, 0.7, 0.3], // 70% call, 30% raise
      ]);
      expect(result[0]).toBe(0.0);
      expect(result[1]).toBeCloseTo(0.5); // Average call
      expect(result[2]).toBeCloseTo(0.5); // Average raise
    });
  });

  describe('mapActionType', () => {
    it('should map FOLD action', () => {
      expect(service['mapActionType']('FOLD')).toBe(ActionType.FOLD);
      expect(service['mapActionType']('fold')).toBe(ActionType.FOLD);
      expect(service['mapActionType']('Fold')).toBe(ActionType.FOLD);
    });

    it('should map CALL action', () => {
      expect(service['mapActionType']('CALL')).toBe(ActionType.CALL);
      expect(service['mapActionType']('call')).toBe(ActionType.CALL);
    });

    it('should map CHECK action', () => {
      expect(service['mapActionType']('CHECK')).toBe(ActionType.CHECK);
      expect(service['mapActionType']('check')).toBe(ActionType.CHECK);
    });

    it('should map RAISE action', () => {
      expect(service['mapActionType']('RAISE')).toBe(ActionType.RAISE);
      expect(service['mapActionType']('raise')).toBe(ActionType.RAISE);
    });

    it('should map BET action as RAISE', () => {
      expect(service['mapActionType']('BET 1.000000')).toBe(ActionType.RAISE);
      expect(service['mapActionType']('BET 2.000000')).toBe(ActionType.RAISE);
      expect(service['mapActionType']('bet')).toBe(ActionType.RAISE);
    });

    it('should default to FOLD for unknown actions', () => {
      expect(service['mapActionType']('UNKNOWN')).toBe(ActionType.FOLD);
      expect(service['mapActionType']('')).toBe(ActionType.FOLD);
    });
  });

  describe('findRootStrategy', () => {
    it('should find root strategy when player matches', () => {
      const mockJson = {
        node_type: 'action_node',
        player: 1,
        strategy: {
          actions: ['CHECK', 'BET'],
          strategy: { AcKc: [0.5, 0.5] },
        },
      };

      const result = TexasSolverService['findRootStrategy'](mockJson, 1);
      expect(result).toBeDefined();
      expect(result.actions).toEqual(['CHECK', 'BET']);
      expect(result.strategy).toEqual({ AcKc: [0.5, 0.5] });
    });

    it('should find root strategy when player is undefined', () => {
      const mockJson = {
        node_type: 'action_node',
        strategy: {
          actions: ['CHECK', 'BET'],
          strategy: { AcKc: [0.5, 0.5] },
        },
      };

      const result = TexasSolverService['findRootStrategy'](mockJson, 1);
      expect(result).toBeDefined();
      expect(result.actions).toEqual(['CHECK', 'BET']);
    });

    it('should find nested strategy in childrens', () => {
      const mockJson = {
        node_type: 'action_node',
        player: 0,
        strategy: {
          actions: ['FOLD', 'CALL'],
          strategy: {},
        },
        childrens: {
          BET: {
            node_type: 'action_node',
            player: 1,
            strategy: {
              actions: ['CHECK', 'BET'],
              strategy: { AcKc: [0.5, 0.5] },
            },
          },
        },
      };

      const result = TexasSolverService['findRootStrategy'](mockJson, 1);
      expect(result).toBeDefined();
      expect(result.actions).toEqual(['CHECK', 'BET']);
    });

    it('should return null when strategy not found', () => {
      const mockJson = {
        node_type: 'action_node',
        player: 0,
        strategy: {
          actions: ['FOLD'],
          strategy: {},
        },
        childrens: {},
      };

      const result = TexasSolverService['findRootStrategy'](mockJson, 1);
      expect(result).toBeNull();
    });

    it('should handle deeply nested structures', () => {
      const mockJson = {
        node_type: 'action_node',
        player: 0,
        childrens: {
          CHECK: {
            node_type: 'action_node',
            player: 1,
            childrens: {
              BET: {
                node_type: 'action_node',
                player: 1,
                strategy: {
                  actions: ['CALL', 'FOLD'],
                  strategy: { AcKc: [1.0, 0.0] },
                },
              },
            },
          },
        },
      };

      const result = TexasSolverService['findRootStrategy'](mockJson, 1);
      expect(result).toBeDefined();
      expect(result.actions).toEqual(['CALL', 'FOLD']);
    });
  });

  describe('generateConfigFile', () => {
    it('should generate config for preflop scenario', async () => {
      const result = await service['generateConfigFile']({
        effectiveStack: 100,
        pot: 1.5,
        rangeIp: 'AA,KK,QQ',
        rangeOop: 'AA,KK,QQ,JJ',
      });

      expect(result).toHaveProperty('configPath');
      expect(result).toHaveProperty('outputPath');
      expect(mockWriteFile).toHaveBeenCalled();
      const configContent = mockWriteFile.mock.calls[0][1];

      expect(configContent).toContain('set_pot 1.5');
      expect(configContent).toContain('set_effective_stack 100');
      expect(configContent).toMatch(/^set_board$/m); // Empty board for preflop (standalone line)
      expect(configContent).toContain('set_range_ip AA,KK,QQ');
      expect(configContent).toContain('set_range_oop AA,KK,QQ,JJ');
      expect(configContent).toContain('set_allin_threshold 0.67');
      expect(configContent).toContain('build_tree');
      expect(configContent).toContain('start_solve');
      expect(configContent).toMatch(/dump_result output_result-\d+\.json/); // Timestamped filename
    });

    it('should include board when provided', async () => {
      const result = await service['generateConfigFile']({
        effectiveStack: 100,
        pot: 1.5,
        rangeIp: 'AA,KK',
        rangeOop: 'AA,KK,QQ',
        board: 'As,Kh,Qd',
      });

      expect(result).toHaveProperty('configPath');
      expect(result).toHaveProperty('outputPath');
      const configContent = mockWriteFile.mock.calls[0][1];
      expect(configContent).toContain('set_board As,Kh,Qd');
      expect(configContent).not.toMatch(/set_board\s*$/); // Should not be empty
    });

    it('should set dump rounds for flop (3 cards)', async () => {
      await service['generateConfigFile']({
        effectiveStack: 100,
        pot: 1.5,
        rangeIp: 'AA,KK',
        rangeOop: 'AA,KK,QQ',
        board: 'As,Kh,Qd', // 3 cards = flop
      });

      const configContent = mockWriteFile.mock.calls[0][1];
      expect(configContent).toContain('set_dump_rounds 2'); // Flop
    });

    it('should set dump rounds for turn (4 cards)', async () => {
      await service['generateConfigFile']({
        effectiveStack: 100,
        pot: 1.5,
        rangeIp: 'AA,KK',
        rangeOop: 'AA,KK,QQ',
        board: 'As,Kh,Qd,2c', // 4 cards = turn
      });

      const configContent = mockWriteFile.mock.calls[0][1];
      expect(configContent).toContain('set_dump_rounds 3'); // Turn
    });

    it('should set dump rounds for river (5 cards)', async () => {
      await service['generateConfigFile']({
        effectiveStack: 100,
        pot: 1.5,
        rangeIp: 'AA,KK',
        rangeOop: 'AA,KK,QQ',
        board: 'As,Kh,Qd,2c,9h', // 5 cards = river
      });

      const configContent = mockWriteFile.mock.calls[0][1];
      expect(configContent).toContain('set_dump_rounds 4'); // River
    });

    it('should not set dump rounds for preflop', async () => {
      await service['generateConfigFile']({
        effectiveStack: 100,
        pot: 1.5,
        rangeIp: 'AA,KK',
        rangeOop: 'AA,KK,QQ',
        // No board = preflop
      });

      const configContent = mockWriteFile.mock.calls[0][1];
      expect(configContent).not.toContain('set_dump_rounds');
    });

    it('should set bet sizes for flop, turn, and river when board has 3 cards (flop)', async () => {
      await service['generateConfigFile']({
        effectiveStack: 100,
        pot: 1.5,
        rangeIp: 'AA,KK',
        rangeOop: 'AA,KK,QQ',
        board: 'As,Kh,Qd', // 3 cards = flop
      });

      const configContent = mockWriteFile.mock.calls[0][1];
      // Flop bet sizes
      expect(configContent).toContain('set_bet_sizes ip,flop,bet,50');
      expect(configContent).toContain('set_bet_sizes ip,flop,raise,60');
      expect(configContent).toContain('set_bet_sizes oop,flop,bet,50');
      expect(configContent).toContain('set_bet_sizes oop,flop,raise,60');
      // Turn bet sizes (future street)
      expect(configContent).toContain('set_bet_sizes ip,turn,bet,50');
      expect(configContent).toContain('set_bet_sizes ip,turn,raise,60');
      expect(configContent).toContain('set_bet_sizes oop,turn,bet,50');
      expect(configContent).toContain('set_bet_sizes oop,turn,raise,60');
      // River bet sizes (future street)
      expect(configContent).toContain('set_bet_sizes ip,river,bet,50');
      expect(configContent).toContain('set_bet_sizes ip,river,raise,60');
      expect(configContent).toContain('set_bet_sizes oop,river,bet,50');
      expect(configContent).toContain('set_bet_sizes oop,river,raise,60');
    });

    it('should set bet sizes for turn and river when board has 4 cards (turn)', async () => {
      await service['generateConfigFile']({
        effectiveStack: 100,
        pot: 1.5,
        rangeIp: 'AA,KK',
        rangeOop: 'AA,KK,QQ',
        board: 'As,Kh,Qd,2c', // 4 cards = turn
      });

      const configContent = mockWriteFile.mock.calls[0][1];
      // Should NOT include flop bet sizes (we're past flop)
      expect(configContent).not.toContain('set_bet_sizes ip,flop');
      expect(configContent).not.toContain('set_bet_sizes oop,flop');
      // Should include turn bet sizes
      expect(configContent).toContain('set_bet_sizes ip,turn,bet,50');
      expect(configContent).toContain('set_bet_sizes ip,turn,raise,60');
      expect(configContent).toContain('set_bet_sizes oop,turn,bet,50');
      expect(configContent).toContain('set_bet_sizes oop,turn,raise,60');
      // Should include river bet sizes (future street)
      expect(configContent).toContain('set_bet_sizes ip,river,bet,50');
      expect(configContent).toContain('set_bet_sizes ip,river,raise,60');
      expect(configContent).toContain('set_bet_sizes oop,river,bet,50');
      expect(configContent).toContain('set_bet_sizes oop,river,raise,60');
    });

    it('should set bet sizes for river only when board has 5 cards (river)', async () => {
      await service['generateConfigFile']({
        effectiveStack: 100,
        pot: 1.5,
        rangeIp: 'AA,KK',
        rangeOop: 'AA,KK,QQ',
        board: 'As,Kh,Qd,2c,9h', // 5 cards = river
      });

      const configContent = mockWriteFile.mock.calls[0][1];
      // Should NOT include flop or turn bet sizes (we're past those streets)
      expect(configContent).not.toContain('set_bet_sizes ip,flop');
      expect(configContent).not.toContain('set_bet_sizes oop,flop');
      expect(configContent).not.toContain('set_bet_sizes ip,turn');
      expect(configContent).not.toContain('set_bet_sizes oop,turn');
      // Should include river bet sizes only
      expect(configContent).toContain('set_bet_sizes ip,river,bet,50');
      expect(configContent).toContain('set_bet_sizes ip,river,raise,60');
      expect(configContent).toContain('set_bet_sizes oop,river,bet,50');
      expect(configContent).toContain('set_bet_sizes oop,river,raise,60');
    });

    it('should not set post-flop bet sizes for preflop', async () => {
      await service['generateConfigFile']({
        effectiveStack: 100,
        pot: 1.5,
        rangeIp: 'AA,KK',
        rangeOop: 'AA,KK,QQ',
        // No board = preflop
      });

      const configContent = mockWriteFile.mock.calls[0][1];
      expect(configContent).not.toContain('set_bet_sizes ip,flop');
      expect(configContent).not.toContain('set_bet_sizes oop,flop');
      expect(configContent).not.toContain('set_bet_sizes ip,turn');
      expect(configContent).not.toContain('set_bet_sizes oop,turn');
      expect(configContent).not.toContain('set_bet_sizes ip,river');
      expect(configContent).not.toContain('set_bet_sizes oop,river');
    });

    it('should use default solver settings for production', async () => {
      const result = await service['generateConfigFile']({
        effectiveStack: 100,
        pot: 1.5,
        rangeIp: 'AA,KK',
        rangeOop: 'AA,KK,QQ',
      });

      expect(result).toHaveProperty('configPath');
      expect(result).toHaveProperty('outputPath');
      const configContent = mockWriteFile.mock.calls[0][1];
      expect(configContent).toContain('set_thread_num 8');
      // Production defaults: accuracy 0.5, iterations 100
      expect(configContent).toContain('set_accuracy 0.5');
      expect(configContent).toContain('set_max_iteration 100');
      expect(configContent).toContain('set_print_interval 10');
      expect(configContent).toContain('set_use_isomorphism 1');
    });

    it('should use custom solver settings when provided', async () => {
      const result = await service['generateConfigFile']({
        effectiveStack: 100,
        pot: 1.5,
        rangeIp: 'AA,KK',
        rangeOop: 'AA,KK,QQ',
        accuracy: 0.3,
        maxIterations: 300,
      });

      expect(result).toHaveProperty('configPath');
      expect(result).toHaveProperty('outputPath');
      const configContent = mockWriteFile.mock.calls[0][1];
      expect(configContent).toContain('set_accuracy 0.3');
      expect(configContent).toContain('set_max_iteration 300');
    });

    it('should create temp directory before writing', async () => {
      const result = await service['generateConfigFile']({
        effectiveStack: 100,
        pot: 1.5,
        rangeIp: 'AA,KK',
        rangeOop: 'AA,KK,QQ',
      });

      expect(result).toHaveProperty('configPath');
      expect(result).toHaveProperty('outputPath');
      expect(mockMkdir).toHaveBeenCalled();
    });
  });

  describe('parseAndTransform', () => {
    it('should parse root strategy and aggregate combos', async () => {
      const mockJson = JSON.stringify({
        node_type: 'action_node',
        player: 1,
        strategy: {
          actions: ['CHECK', 'BET 1.000000'],
          strategy: {
            AcKc: [0.0, 1.0], // AKs combo 1
            AcKd: [0.0, 1.0], // AKo combo 1
            AdKc: [0.0, 1.0], // AKo combo 2
            AdAc: [0.0, 1.0], // AA combo 1
            AhAc: [0.0, 1.0], // AA combo 2
            AdAd: [0.0, 1.0], // AA combo 3
          },
        },
      });

      mockReadFile.mockResolvedValue(mockJson);

      const result = await service['parseAndTransform']('/path/to/output.json', PlayerPosition.OOP);

      expect(result).toHaveLength(3); // AKs, AKo, AA

      const akHand = result.find((h) => h.label === 'AKs');
      expect(akHand).toBeDefined();
      expect(akHand?.actions).toHaveLength(1);
      expect(akHand?.actions[0].type).toBe(ActionType.RAISE);
      expect(akHand?.actions[0].frequency).toBe(100);
    });

    it('should handle mixed strategies correctly', async () => {
      const mockJson = JSON.stringify({
        node_type: 'action_node',
        player: 0,
        strategy: {
          actions: ['FOLD', 'CALL', 'RAISE'],
          strategy: {
            AcKc: [0.0, 0.5, 0.5], // 50% call, 50% raise
            AcKd: [0.0, 0.3, 0.7], // 30% call, 70% raise
            AdKc: [0.0, 0.7, 0.3], // 70% call, 30% raise
          },
        },
      });

      mockReadFile.mockResolvedValue(mockJson);

      const result = await service['parseAndTransform']('/path/to/output.json', PlayerPosition.IP);

      const akHand = result.find((h) => h.label === 'AKo');
      expect(akHand).toBeDefined();
      expect(akHand?.actions).toHaveLength(2);

      const callAction = akHand?.actions.find((a) => a.type === ActionType.CALL);
      const raiseAction = akHand?.actions.find((a) => a.type === ActionType.RAISE);

      expect(callAction?.frequency).toBeCloseTo(50); // Averaged
      expect(raiseAction?.frequency).toBeCloseTo(50); // Averaged
    });

    it('should filter out zero-frequency actions', async () => {
      const mockJson = JSON.stringify({
        node_type: 'action_node',
        player: 1,
        strategy: {
          actions: ['CHECK', 'BET 1.000000'],
          strategy: {
            AcKc: [1.0, 0.0], // 100% CHECK, 0% BET
            AcKd: [0.0, 1.0], // 0% CHECK, 100% BET
          },
        },
      });

      mockReadFile.mockResolvedValue(mockJson);

      const result = await service['parseAndTransform']('/path/to/output.json', PlayerPosition.OOP);

      const akHand = result.find((h) => h.label === 'AKo');
      expect(akHand?.actions).toHaveLength(1); // Only BET, CHECK filtered out
      expect(akHand?.actions[0].type).toBe(ActionType.RAISE);
    });

    it('should handle missing strategy gracefully', async () => {
      const mockJson = JSON.stringify({
        node_type: 'action_node',
        player: 1,
        strategy: {
          actions: ['CHECK'],
          strategy: {},
        },
      });

      mockReadFile.mockResolvedValue(mockJson);

      const result = await service['parseAndTransform']('/path/to/output.json', PlayerPosition.OOP);
      expect(result).toHaveLength(0);
    });

    it('should throw error when root strategy not found', async () => {
      const mockJson = JSON.stringify({
        node_type: 'action_node',
        player: 0,
        strategy: {
          actions: ['CHECK'],
          strategy: {},
        },
      });

      mockReadFile.mockResolvedValue(mockJson);

      await expect(
        service['parseAndTransform']('/path/to/output.json', PlayerPosition.OOP),
      ).rejects.toThrow('Could not find root strategy');
    });
  });

  describe('solveScenario', () => {
    it('should solve scenario and return Range', async () => {
      // Mock solver output
      const mockSolverOutput = JSON.stringify({
        node_type: 'action_node',
        player: 1,
        strategy: {
          actions: ['CHECK', 'BET 1.000000'],
          strategy: {
            AcKc: [0.0, 1.0],
            AdAc: [0.0, 1.0],
          },
        },
      });

      mockReadFile.mockResolvedValue(mockSolverOutput);

      const result = await service.solveScenario({
        name: 'Test Scenario',
        effectiveStack: 100,
        pot: 1.5,
        rangeIp: 'AA,KK',
        rangeOop: 'AA,KK,QQ',
        playerPosition: PlayerPosition.OOP,
      });

      expect(result).toBeDefined();
      expect(result.name).toBe('Test Scenario');
      expect(result.userId).toBe('system');
      expect(result.handsRange).toBeDefined();
      expect(result.handsRange.length).toBeGreaterThan(0);
    });

    it('should convert space-separated board cards to comma-separated format', async () => {
      // Mock solver output
      const mockSolverOutput = JSON.stringify({
        node_type: 'action_node',
        player: 1,
        strategy: {
          actions: ['CHECK', 'BET 1.000000'],
          strategy: {
            AcKc: [0.0, 1.0],
          },
        },
      });

      mockReadFile.mockResolvedValue(mockSolverOutput);

      await service.solveScenario({
        name: 'Flop Scenario',
        effectiveStack: 100,
        pot: 1.5,
        rangeIp: 'AA,KK',
        rangeOop: 'AA,KK,QQ',
        playerPosition: PlayerPosition.OOP,
        boardCards: 'As Kh 7d', // Space-separated format
      });

      // Verify that generateConfigFile was called with comma-separated format
      expect(mockWriteFile).toHaveBeenCalled();
      const configContent = mockWriteFile.mock.calls[0][1];
      expect(configContent).toContain('set_board As,Kh,7d'); // Comma-separated
      expect(configContent).toContain('set_dump_rounds 2'); // Flop dump rounds

      // Verify solver was executed
      expect(mockExecFileAsyncFn).toHaveBeenCalled();
    });

    it('should handle solver execution errors', async () => {
      mockExecFileAsyncFn.mockRejectedValue(new Error('Solver failed'));

      await expect(
        service.solveScenario({
          name: 'Test',
          effectiveStack: 100,
          pot: 1.5,
          rangeIp: 'AA',
          rangeOop: 'AA,KK',
          playerPosition: PlayerPosition.IP,
        }),
      ).rejects.toThrow();
    });

    it('should handle missing output file', async () => {
      mockExecFileAsyncFn.mockResolvedValue({ stdout: '', stderr: '' });
      mockAccess.mockRejectedValue(new Error('File not found'));

      await expect(
        service.solveScenario({
          name: 'Test',
          effectiveStack: 100,
          pot: 1.5,
          rangeIp: 'AA',
          rangeOop: 'AA,KK',
          playerPosition: PlayerPosition.IP,
        }),
      ).rejects.toThrow('Solver execution failed');
    });

    it('should execute solver with correct parameters', async () => {
      const mockSolverOutput = JSON.stringify({
        node_type: 'action_node',
        player: 1,
        strategy: {
          actions: ['CHECK', 'BET 1.000000'],
          strategy: {
            AcKc: [0.0, 1.0],
          },
        },
      });

      mockReadFile.mockResolvedValue(mockSolverOutput);

      await service.solveScenario({
        name: 'Test',
        effectiveStack: 100,
        pot: 1.5,
        rangeIp: 'AA',
        rangeOop: 'AA,KK',
        playerPosition: PlayerPosition.OOP,
      });

      expect(mockExecFileAsyncFn).toHaveBeenCalled();
      const callArgs = mockExecFileAsyncFn.mock.calls[0];
      expect(callArgs[0]).toContain('console_solver');
      expect(callArgs[1]).toContain('-i');
      expect(callArgs[1]).toContain('-r');
      expect(callArgs[1]).toContain('-m');
      expect(callArgs[1]).toContain('holdem');
    });
  });

  describe('formatRangeForSolver', () => {
    it('should format range array correctly', () => {
      const result = TexasSolverService.formatRangeForSolver(['AA', 'KK', 'AKs']);
      expect(result).toBe('AA,KK,AKs');
    });

    it('should handle single hand', () => {
      const result = TexasSolverService.formatRangeForSolver(['AA']);
      expect(result).toBe('AA');
    });

    it('should handle empty array', () => {
      const result = TexasSolverService.formatRangeForSolver([]);
      expect(result).toBe('');
    });
  });
});
