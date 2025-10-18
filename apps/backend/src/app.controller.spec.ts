import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getHealth', () => {
    it('should return health status with UP status', () => {
      const result = controller.getHealth();

      expect(result).toHaveProperty('status', 'UP');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('service', 'backend');
    });

    it('should return ISO 8601 formatted timestamp', () => {
      const result = controller.getHealth();

      // Verify timestamp is a valid ISO 8601 date string
      expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);

      // Verify timestamp is recent (within last second)
      const timestampDate = new Date(result.timestamp);
      const now = new Date();
      const diffInMs = now.getTime() - timestampDate.getTime();
      expect(diffInMs).toBeLessThan(1000);
    });

    it('should return consistent structure on multiple calls', () => {
      const result1 = controller.getHealth();
      const result2 = controller.getHealth();

      expect(result1.status).toBe(result2.status);
      expect(result1.service).toBe(result2.service);
      expect(result1).toHaveProperty('timestamp');
      expect(result2).toHaveProperty('timestamp');
    });
  });
});
