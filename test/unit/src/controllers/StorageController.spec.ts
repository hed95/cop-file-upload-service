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
  const email: string = 'officer@homeoffice.gov.uk';
  const businessKey: string = 'BF-20191218-798';

  beforeEach(() => {
    req = requestMock({
      allFiles: {},
      body: {},
      file: testFile,
      kauth: {
        grant: {
          access_token: {
            content: {
              email
            }
          }
        }
      },
      logger: sinon.spy(),
      params: {
        file: testFile
      }
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
          expect(s3Service.downloadFile).to.have.been.calledOnceWithExactly(req.params);
          expect(req.logger).to.have.been.calledTwice;
          expect(req.logger).to.have.been.calledWith('Downloading file');
          expect(req.logger).to.have.been.calledWith('File downloaded');
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
          expect(req.logger).to.have.been.calledThrice;
          expect(req.logger).to.have.been.calledWith('Downloading file');
          expect(req.logger).to.have.been.calledWith('Failed to download file');
          expect(req.logger).to.have.been.calledWith('Error: Internal Server Error');
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
    beforeEach(() => {
      testFile.buffer = fs.readFileSync('test/data/test-file.pdf');
      s3Service = {
        uploadFile: sinon.stub().returns({Location: 'http://localhost/a-file'})
      };
      req.allFiles[config.fileVersions.original] = testFile;
    });

    it('should log the correct messages and call next() when a file is uploaded successfully', (done) => {
      req.params.businessKey = businessKey;

      storageController = new StorageController(s3Service, config);

      storageController
        .uploadFile(req, res, next)
        .then(() => {
          expect(s3Service.uploadFile).to.have.been.calledOnceWithExactly({
            businessKey,
            email,
            file: testFile
          });
          expect(req.logger).to.have.been.calledTwice;
          expect(req.logger).to.have.been.calledWith(`Uploading file - ${config.fileVersions.original} version`);
          expect(req.logger).to.have.been.calledWith(`File uploaded - ${config.fileVersions.original} version`);
          expect(next).to.have.been.calledOnce;
          expect(req.allFiles).to.be.empty;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should call next() when a file is not available to be uploaded', (done) => {
      req.params.businessKey = businessKey;
      req.allFiles = {};

      storageController = new StorageController(s3Service, config);

      storageController
        .uploadFile(req, res, next)
        .then(() => {
          expect(s3Service.uploadFile).not.to.have.been.called;
          expect(req.logger).not.to.have.been.called;
          expect(next).to.have.been.calledOnce;
          expect(req.allFiles).to.be.empty;
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should log the correct messages and return an error message when the storage service is not available', (done) => {
      s3Service = {
        uploadFile: sinon.stub().returns(Promise.reject(new Error('Internal Server Error')))
      };

      storageController = new StorageController(s3Service, config);

      storageController
        .uploadFile(req, res, next)
        .then(() => {
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
        deleteFiles: sinon.spy()
      };

      storageController = new StorageController(s3Service, config);

      storageController
        .deleteFiles(req, res)
        .then(() => {
          expect(s3Service.deleteFiles).to.have.been.calledOnceWithExactly(req.params);
          expect(req.logger).to.have.been.calledTwice;
          expect(req.logger).to.have.been.calledWith('Deleting files');
          expect(req.logger).to.have.been.calledWith('Files deleted');
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
          expect(req.logger).to.have.been.calledThrice;
          expect(req.logger).to.have.been.calledWith('Deleting files');
          expect(req.logger).to.have.been.calledWith('Failed to delete files');
          expect(req.logger).to.have.been.calledWith('Error: Internal Server Error');
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

  describe('listFiles()', () => {
    it('should return the correct data when a file list is returned', (done) => {
      s3Service = {
        listFiles: sinon.stub().returns({
          Contents: [{
            ETag: '"813c075f66e5874005546cb06a4ff080"',
            Key: 'BF-20200228-123/clean/3f5a2581-cb04-4edc-824f-ebf39d51ca0b',
            LastModified: '2020-02-27T14:27:55.000Z',
            Size: 36729,
            StorageClass: 'STANDARD'
          }]
        }),
        listMetadata: sinon.stub().resolves({
          ETag: '"813c075f66e5874005546cb06a4ff080"',
          Metadata: {
            email: 'officer@homeoffice.gov.uk',
            originalfilename: 'ocr-test-file-3.png',
            processedtime: '1582625526348'
          }
      })
      };
      storageController = new StorageController(s3Service, config);

      storageController
        .listFiles(req, res)
        .then(() => {
          expect(res.status).to.have.been.calledOnceWithExactly(200);
          expect(res.json).to.have.been.calledOnceWithExactly([{
            submittedDateTime: '2020-02-25 10:12:06',
            submittedEmail: 'officer@homeoffice.gov.uk',
            submittedFilename: 'ocr-test-file-3.png',
            url: 'https://localhost/files/BF-20200228-123/clean/3f5a2581-cb04-4edc-824f-ebf39d51ca0b'
          }]);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should return an error message when the storage service is not available', (done) => {
      req.params.filename = testFile.originalname;
      s3Service = {
        listFiles: sinon.stub().returns(Promise.reject(new Error('Internal Server Error')))
      };
      storageController = new StorageController(s3Service, config);

      storageController
        .listFiles(req, res)
        .then(() => {
          expect(res.status).to.have.been.calledOnceWithExactly(500);
          expect(res.json).to.have.been.calledOnceWithExactly({error: 'Failed to download file list'});
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
