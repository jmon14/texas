// NestJS
import { Test } from '@nestjs/testing';

// Controller
import { FilesController } from '../files.controller';

// Services
import { FilesService } from '../files.service';

// Entities
import FileEntity from '../../database/entities/file.entity';

// Mocks
import { mockPayloadReq } from '../../utils/mocks';

describe('FilesController', () => {
  let filesController: FilesController;
  let filesService: FilesService;
  let mockFile: FileEntity;

  const mockedFilesService = {
    getFiles: jest.fn(),
    getFilesById: jest.fn(),
    uploadFile: jest.fn(),
    deleteFiles: jest.fn(),
    deleteFilesById: jest.fn(),
  };

  beforeEach(async () => {
    mockFile = {
      uuid: 'file-uuid',
      key: 'test-key',
      url: 'https://bucket.s3.amazonaws.com/test-key',
      name: 'test-file.pdf',
      size: 1024,
      user: 'user-uuid',
    } as FileEntity;

    const module = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        {
          provide: FilesService,
          useValue: mockedFilesService,
        },
      ],
    }).compile();

    filesController = module.get<FilesController>(FilesController);
    filesService = module.get<FilesService>(FilesService);
  });

  describe('getFiles', () => {
    it('should return all files', async () => {
      const mockFiles = [mockFile];
      jest.spyOn(filesService, 'getFiles').mockResolvedValue(mockFiles);

      const result = await filesController.getFiles();

      expect(filesService.getFiles).toHaveBeenCalled();
      expect(result).toEqual(mockFiles);
    });
  });

  describe('getFilesById', () => {
    it('should return file by id', async () => {
      jest.spyOn(filesService, 'getFilesById').mockResolvedValue(mockFile);

      const result = await filesController.getFilesById({ id: 'file-uuid' });

      expect(filesService.getFilesById).toHaveBeenCalledWith('file-uuid');
      expect(result).toEqual(mockFile);
    });

    it('should return null if file not found', async () => {
      jest.spyOn(filesService, 'getFilesById').mockResolvedValue(null);

      const result = await filesController.getFilesById({ id: 'non-existent-uuid' });

      expect(result).toBeNull();
    });
  });

  describe('uploadFile', () => {
    it('should upload file and return file entity', async () => {
      const mockMulterFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'test-file.pdf',
        encoding: '7bit',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from('test file content'),
        stream: null,
        destination: '',
        filename: '',
        path: '',
      };

      jest.spyOn(filesService, 'uploadFile').mockResolvedValue(mockFile);

      const result = await filesController.uploadFile(mockMulterFile, mockPayloadReq);

      expect(filesService.uploadFile).toHaveBeenCalledWith(
        mockMulterFile.buffer,
        mockMulterFile.originalname,
        mockMulterFile.size,
        mockPayloadReq.user.uuid,
      );
      expect(result).toEqual(mockFile);
    });

    it('should handle upload errors', async () => {
      const mockMulterFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'test-file.pdf',
        encoding: '7bit',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from('test file content'),
        stream: null,
        destination: '',
        filename: '',
        path: '',
      };

      jest.spyOn(filesService, 'uploadFile').mockRejectedValue(new Error('Upload failed'));

      await expect(filesController.uploadFile(mockMulterFile, mockPayloadReq)).rejects.toThrow(
        'Upload failed',
      );
    });
  });

  describe('deleteFiles', () => {
    it('should delete all files', async () => {
      jest.spyOn(filesService, 'deleteFiles').mockResolvedValue(undefined);

      await filesController.deleteFiles();

      expect(filesService.deleteFiles).toHaveBeenCalled();
    });
  });

  describe('deleteFilesById', () => {
    it('should delete file by id', async () => {
      jest.spyOn(filesService, 'deleteFilesById').mockResolvedValue(undefined);

      await filesController.deleteFilesById({ id: 'file-uuid' });

      expect(filesService.deleteFilesById).toHaveBeenCalledWith('file-uuid');
    });

    it('should handle deletion errors', async () => {
      jest.spyOn(filesService, 'deleteFilesById').mockRejectedValue(new Error('Deletion failed'));

      await expect(filesController.deleteFilesById({ id: 'file-uuid' })).rejects.toThrow(
        'Deletion failed',
      );
    });
  });
});
