import {NextFunction, Request, Response} from 'express';
import * as fs from 'fs';
import StorageController from '../../../../src/controllers/StorageController';
import {config, expect, requestMock, responseMock, sinon, testFile} from '../../../setupTests';

describe('StorageController', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;
  let s3Service: any;
  let storageController: StorageController;

  beforeEach(() => {
    req = requestMock({
      body: {},
      file: testFile,
      logger: {
        error: sinon.spy(),
        info: sinon.spy()
      },
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
    it('should log the correct messages and return a success message when a file is downloaded successfully', (done) => {
      s3Service = {
        downloadFile: sinon.stub().returns({
          Body: 'some body content',
          Metadata: {
            originalfilename: testFile.originalname
          }
        })
      };
      storageController = new StorageController(s3Service, config);

      storageController
        .downloadFile(req, res)
        .then(() => {
          expect(req.logger.info).to.have.been.calledTwice;
          expect(req.logger.info).to.have.been.calledWith('Downloading file');
          expect(req.logger.info).to.have.been.calledWith('File downloaded');
          expect(res.status).to.have.been.calledOnce;
          expect(res.status).to.have.been.calledWith(200);
          expect(res.send).to.have.been.calledOnce;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should log the correct messages and return an error message when the storage service is not available', (done) => {
      req.params.filename = testFile.originalname;
      s3Service = {
        downloadFile: sinon.stub().returns(Promise.reject(new Error('Internal Server Error')))
      };
      storageController = new StorageController(s3Service, config);

      storageController
        .downloadFile(req, res)
        .then(() => {
          expect(req.logger.info).to.have.been.calledOnce;
          expect(req.logger.info).to.have.been.calledWith('Downloading file');
          expect(req.logger.error).to.have.been.calledTwice;
          expect(req.logger.error).to.have.been.calledWith('Failed to download file');
          expect(req.logger.error).to.have.been.calledWith('Error: Internal Server Error');
          expect(res.status).to.have.been.calledOnce;
          expect(res.status).to.have.been.calledWith(500);
          expect(res.json).to.have.been.calledOnce;
          expect(res.json).to.have.been.calledWith({error: 'Failed to download file'});
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('uploadFile()', () => {
    it('should log the correct messages and call next() when a file is uploaded successfully and the file version exists', (done) => {
      testFile.buffer = new Buffer(fs.readFileSync('test/data/test-file.txt'));
      s3Service = {
        uploadFile: sinon.stub().returns({Location: 'http://localhost/a-file'})
      };
      req.params.processKey = 'test-process-key';
      storageController = new StorageController(s3Service, config);

      storageController
        .uploadFile(req, res, next)
        .then(() => {
          expect(req.logger.info).to.have.been.calledTwice;
          expect(req.logger.info).to.have.been.calledWith(`Uploading file - ${config.fileVersions.original} version`);
          expect(req.logger.info).to.have.been.calledWith(`File uploaded - ${config.fileVersions.original} version`);
          expect(next).to.have.been.calledOnce;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should log the correct messages and call next() when a file is uploaded successfully and the file version does not exist', (done) => {
      testFile.buffer = new Buffer(fs.readFileSync('test/data/test-file.txt'));

      s3Service = {
        uploadFile: sinon.stub().returns({Location: 'http://localhost/a-file'})
      };

      req.params.processKey = 'test-process-key';
      delete req.file.version;

      storageController = new StorageController(s3Service, config);

      storageController
        .uploadFile(req, res, next)
        .then(() => {
          expect(req.logger.info).to.have.been.calledTwice;
          expect(req.logger.info).to.have.been.calledWith(`Uploading file - ${config.fileVersions.original} version`);
          expect(req.logger.info).to.have.been.calledWith(`File uploaded - ${config.fileVersions.original} version`);
          expect(next).to.have.been.calledOnce;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should log the correct messages and return an error message when the storage service is not available', (done) => {
      testFile.buffer = new Buffer(fs.readFileSync('test/data/test-file.txt'));

      s3Service = {
        uploadFile: sinon.stub().returns(Promise.reject(new Error('Internal Server Error')))
      };

      storageController = new StorageController(s3Service, config);

      storageController
        .uploadFile(req, res, next)
        .then(() => {
          expect(req.logger.info).to.have.been.calledOnce;
          expect(req.logger.info).to.have.been.calledWith(`Uploading file - ${config.fileVersions.original} version`);
          expect(req.logger.error).to.have.been.calledTwice;
          expect(req.logger.error).to.have.been.calledWith(
            `Failed to upload file - ${config.fileVersions.original} version`
          );
          expect(req.logger.error).to.have.been.calledWith('Error: Internal Server Error');
          expect(res.status).to.have.been.calledOnce;
          expect(res.status).to.have.been.calledWith(500);
          expect(res.json).to.have.been.calledOnce;
          expect(res.json).to.have.been.calledWith({
            error: `Failed to upload file - ${config.fileVersions.original} version`
          });
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('deleteFiles()', () => {
    it('should log the correct messages and return a success message when files are deleted successfully', (done) => {
      s3Service = {
        deleteFiles: () => true
      };

      storageController = new StorageController(s3Service, config);

      storageController
        .deleteFiles(req, res)
        .then(() => {
          expect(req.logger.info).to.have.been.calledTwice;
          expect(req.logger.info).to.have.been.calledWith('Deleting files');
          expect(req.logger.info).to.have.been.calledWith('Files deleted');
          expect(res.status).to.have.been.calledOnce;
          expect(res.status).to.have.been.calledWith(200);
          expect(res.json).to.have.been.calledOnce;
          expect(res.json).to.have.been.calledWith({message: 'Files deleted successfully'});
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should log the correct messages and return an error message when the storage service is not available', (done) => {
      s3Service = {
        deleteFiles: sinon.stub().returns(Promise.reject(new Error('Internal Server Error')))
      };

      storageController = new StorageController(s3Service, config);

      storageController
        .deleteFiles(req, res)
        .then(() => {
          expect(req.logger.info).to.have.been.calledOnce;
          expect(req.logger.info).to.have.been.calledWith('Deleting files');
          expect(req.logger.error).to.have.been.calledTwice;
          expect(req.logger.error).to.have.been.calledWith('Failed to delete files');
          expect(req.logger.error).to.have.been.calledWith('Error: Internal Server Error');
          expect(res.status).to.have.been.calledOnce;
          expect(res.status).to.have.been.calledWith(500);
          expect(res.json).to.have.been.calledOnce;
          expect(res.json).to.have.been.calledWith({error: 'Failed to delete files'});
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
