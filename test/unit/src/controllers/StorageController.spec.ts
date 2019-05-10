import {NextFunction, Request, Response} from 'express';
import * as fs from 'fs';
import StorageController from '../../../../src/controllers/StorageController';
import {config, expect, fileServiceMock, requestMock, responseMock, sinon, testFile} from '../../../setupTests';

describe('StorageController', () => {
  const fileService: any = new fileServiceMock();
  let req: Request;
  let res: Response;
  let next: NextFunction;
  let s3Service: any;
  let storageController: StorageController;

  beforeEach(() => {
    req = requestMock({
      allFiles: {},
      body: {},
      file: testFile,
      logger: sinon.spy(),
      params: {}
    });
    res = responseMock();
    next = sinon.spy();

    sinon.stub(res, 'status').returns(res);
    sinon.stub(res, 'send').returns(res);
    sinon.stub(res, 'json').returns(res);
    sinon.stub(res, 'set').returns(res);
  });

  describe('downloadFile()', () => {
    it('should log the correct messages and return a success message when a file is downloaded successfully', async () => {
      s3Service = {
        downloadFile: sinon.stub().returns({
          Body: 'some body content',
          Metadata: {
            originalfilename: testFile.originalname
          }
        })
      };
      storageController = new StorageController(s3Service, config, fileService);

      await storageController.downloadFile(req, res);

      expect(req.logger).to.have.been.calledTwice;
      expect(req.logger).to.have.been.calledWith('Downloading file');
      expect(req.logger).to.have.been.calledWith('File downloaded');
      expect(res.status).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledWith(200);
      expect(res.send).to.have.been.calledOnce;
    });

    it('should log the correct messages and return an error message when the storage service is not available', async () => {
      req.params.filename = testFile.originalname;
      s3Service = {
        downloadFile: sinon.stub().returns(Promise.reject(new Error('Internal Server Error')))
      };
      storageController = new StorageController(s3Service, config, fileService);

      await storageController.downloadFile(req, res);

      expect(req.logger).to.have.been.calledThrice;
      expect(req.logger).to.have.been.calledWith('Downloading file');
      expect(req.logger).to.have.been.calledWith('Failed to download file');
      expect(req.logger).to.have.been.calledWith('Error: Internal Server Error');
      expect(res.status).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledWith(500);
      expect(res.json).to.have.been.calledOnce;
      expect(res.json).to.have.been.calledWith({error: 'Failed to download file'});
    });
  });

  describe('uploadFile()', () => {
    beforeEach(() => {
      testFile.buffer = fs.readFileSync('test/data/test-file.pdf');
      s3Service = {
        uploadFile: sinon.stub().returns({Location: 'http://localhost/a-file'})
      };
      req.allFiles[config.fileVersions.original] = testFile;
    });

    it('should log the correct messages and call next() when a file is uploaded successfully', async () => {
      req.params.processKey = 'test-process-key';

      storageController = new StorageController(s3Service, config, fileService);

      await storageController.uploadFile(req, res, next);

      expect(req.logger).to.have.been.calledTwice;
      expect(req.logger).to.have.been.calledWith(`Uploading file - ${config.fileVersions.original} version`);
      expect(req.logger).to.have.been.calledWith(`File uploaded - ${config.fileVersions.original} version`);
      expect(next).to.have.been.calledOnce;
      expect(req.allFiles).to.be.empty;
    });

    it('should log the correct messages and return an error message when the storage service is not available', async () => {
      s3Service = {
        uploadFile: sinon.stub().returns(Promise.reject(new Error('Internal Server Error')))
      };

      storageController = new StorageController(s3Service, config, fileService);

      await storageController.uploadFile(req, res, next);

      expect(req.logger).to.have.been.calledThrice;
      expect(req.logger).to.have.been.calledWith(`Uploading file - ${config.fileVersions.original} version`);
      expect(req.logger).to.have.been.calledWith(`Failed to upload file - ${config.fileVersions.original} version`);
      expect(req.logger).to.have.been.calledWith('Error: Internal Server Error');
      expect(res.status).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledWith(500);
      expect(res.json).to.have.been.calledOnce;
      expect(res.json).to.have.been.calledWith({
        error: `Failed to upload file - ${config.fileVersions.original} version`
      });
    });
  });

  describe('deleteFiles()', () => {
    it('should log the correct messages and return a success message when files are deleted successfully', async () => {
      s3Service = {
        deleteFiles: () => true
      };

      storageController = new StorageController(s3Service, config, fileService);

      await storageController.deleteFiles(req, res);

      expect(req.logger).to.have.been.calledTwice;
      expect(req.logger).to.have.been.calledWith('Deleting files');
      expect(req.logger).to.have.been.calledWith('Files deleted');
      expect(res.status).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledOnce;
      expect(res.json).to.have.been.calledWith({message: 'Files deleted successfully'});
    });

    it('should log the correct messages and return an error message when the storage service is not available', async () => {
      s3Service = {
        deleteFiles: sinon.stub().returns(Promise.reject(new Error('Internal Server Error')))
      };

      storageController = new StorageController(s3Service, config, fileService);

      await storageController.deleteFiles(req, res);

      expect(req.logger).to.have.been.calledThrice;
      expect(req.logger).to.have.been.calledWith('Deleting files');
      expect(req.logger).to.have.been.calledWith('Failed to delete files');
      expect(req.logger).to.have.been.calledWith('Error: Internal Server Error');
      expect(res.status).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledWith(500);
      expect(res.json).to.have.been.calledOnce;
      expect(res.json).to.have.been.calledWith({error: 'Failed to delete files'});
    });
  });
});
