// NestJS
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

// AWS
import { S3 } from 'aws-sdk';

// Services
import { FilesService } from 'src/files/files.service';
import { ConfigurationService } from 'src/config/configuration.service';

// Entities
import FileEntity from 'src/database/entities/file.entity';

// Mocks
import { mockedConfigurationService } from 'src/utils/mocks';

// Mock AWS S3
const mockUpload = jest.fn();
const mockPromise = jest.fn();

jest.mock('aws-sdk');

describe('FilesService', () => {
  let filesService: FilesService;
  let findSpy: jest.Mock;
  let findOneBySpy: jest.Mock;
  let findOneSpy: jest.Mock;
  let createSpy: jest.Mock;
  let saveSpy: jest.Mock;
  let removeSpy: jest.Mock;
  let clearSpy: jest.Mock;
  let mockFile: FileEntity;

  beforeEach(async () => {
    // Reset and setup S3 mocks
    mockUpload.mockClear();
    mockPromise.mockClear();
    mockUpload.mockReturnValue({ promise: mockPromise });

    // Mock S3 constructor
    const { S3 } = require('aws-sdk');
    (S3 as jest.Mock).mockImplementation(() => ({
      upload: mockUpload,
    }));

    // Create mock file
    mockFile = {
      uuid: 'file-uuid',
      key: 'test-key',
      url: 'https://bucket.s3.amazonaws.com/test-key',
      name: 'test-file.pdf',
      size: 1024,
      user: 'user-uuid',
    } as FileEntity;

    // Setup repository mocks
    findSpy = jest.fn();
    findOneBySpy = jest.fn();
    findOneSpy = jest.fn();
    createSpy = jest.fn();
    saveSpy = jest.fn();
    removeSpy = jest.fn();
    clearSpy = jest.fn();

    const module = await Test.createTestingModule({
      providers: [
        FilesService,
        {
          provide: getRepositoryToken(FileEntity),
          useValue: {
            find: findSpy,
            findOneBy: findOneBySpy,
            findOne: findOneSpy,
            create: createSpy,
            save: saveSpy,
            remove: removeSpy,
            clear: clearSpy,
          },
        },
        {
          provide: ConfigurationService,
          useValue: mockedConfigurationService,
        },
      ],
    }).compile();

    filesService = module.get<FilesService>(FilesService);
  });

  describe('getFiles', () => {
    it('should return all files with user relations', async () => {
      const mockFiles = [mockFile];
      findSpy.mockResolvedValue(mockFiles);

      const result = await filesService.getFiles();

      expect(findSpy).toHaveBeenCalledWith({ relations: ['user'] });
      expect(result).toEqual(mockFiles);
    });
  });

  describe('getFilesById', () => {
    it('should return file by uuid', async () => {
      findOneBySpy.mockResolvedValue(mockFile);

      const result = await filesService.getFilesById('file-uuid');

      expect(findOneBySpy).toHaveBeenCalledWith({ uuid: 'file-uuid' });
      expect(result).toEqual(mockFile);
    });

    it('should return null if file not found', async () => {
      findOneBySpy.mockResolvedValue(null);

      const result = await filesService.getFilesById('non-existent-uuid');

      expect(result).toBeNull();
    });
  });

  describe('uploadFile', () => {
    it('should upload file to S3 and save to database', async () => {
      const mockBuffer = Buffer.from('test file content');
      const mockFilename = 'test-file.pdf';
      const mockSize = 1024;
      const mockUserId = 'user-uuid';
      const mockUploadResult = {
        Key: 'generated-key-test-file.pdf',
        Location: 'https://bucket.s3.amazonaws.com/generated-key-test-file.pdf',
      };

      // Mock S3 upload
      mockPromise.mockResolvedValue(mockUploadResult);

      // Mock ConfigurationService
      (mockedConfigurationService.get as jest.Mock).mockResolvedValue('test-bucket');

      // Mock repository
      createSpy.mockReturnValue(mockFile);
      saveSpy.mockResolvedValue(mockFile);

      const result = await filesService.uploadFile(mockBuffer, mockFilename, mockSize, mockUserId);

      // Verify S3 upload was called
      expect(mockUpload).toHaveBeenCalledWith({
        Bucket: 'test-bucket',
        Body: mockBuffer,
        Key: expect.stringContaining('test-file.pdf'),
      });

      // Verify ConfigurationService was called
      expect(mockedConfigurationService.get).toHaveBeenCalledWith('AWS_PUBLIC_BUCKET_NAME');

      // Verify file was created in DB
      expect(createSpy).toHaveBeenCalledWith({
        key: mockUploadResult.Key,
        url: mockUploadResult.Location,
        name: mockFilename,
        size: mockSize,
        user: mockUserId,
      });
      expect(saveSpy).toHaveBeenCalledWith(mockFile);
      expect(result).toEqual(mockFile);
    });

    it('should throw error when S3 upload fails', async () => {
      const mockBuffer = Buffer.from('test');
      const mockError = new Error('S3 upload failed');

      mockPromise.mockRejectedValue(mockError);
      (mockedConfigurationService.get as jest.Mock).mockResolvedValue('test-bucket');

      await expect(
        filesService.uploadFile(mockBuffer, 'test.pdf', 1024, 'user-uuid'),
      ).rejects.toThrow('S3 upload failed');
    });

    it('should throw error when database save fails', async () => {
      const mockBuffer = Buffer.from('test');
      const mockUploadResult = {
        Key: 'test-key',
        Location: 'https://bucket.s3.amazonaws.com/test-key',
      };

      mockPromise.mockResolvedValue(mockUploadResult);
      (mockedConfigurationService.get as jest.Mock).mockResolvedValue('test-bucket');
      createSpy.mockReturnValue(mockFile);
      saveSpy.mockRejectedValue(new Error('Database error'));

      await expect(
        filesService.uploadFile(mockBuffer, 'test.pdf', 1024, 'user-uuid'),
      ).rejects.toThrow('Database error');
    });
  });

  describe('deleteFiles', () => {
    it('should clear all files from database', async () => {
      clearSpy.mockResolvedValue(undefined);

      await filesService.deleteFiles();

      expect(clearSpy).toHaveBeenCalled();
    });
  });

  describe('deleteFilesById', () => {
    it('should delete file by uuid', async () => {
      findOneSpy.mockResolvedValue(mockFile);
      removeSpy.mockResolvedValue(mockFile);

      await filesService.deleteFilesById('file-uuid');

      expect(findOneSpy).toHaveBeenCalledWith({ where: { uuid: 'file-uuid' } });
      expect(removeSpy).toHaveBeenCalledWith(mockFile);
    });

    it('should handle deletion when file is null', async () => {
      findOneSpy.mockResolvedValue(null);
      removeSpy.mockResolvedValue(null);

      // The service doesn't throw an error for null files, it just calls remove
      await filesService.deleteFilesById('non-existent-uuid');

      expect(findOneSpy).toHaveBeenCalledWith({ where: { uuid: 'non-existent-uuid' } });
      expect(removeSpy).toHaveBeenCalledWith(null);
    });
  });
});
