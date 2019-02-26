import {expect, sinon, testFile} from '../../../setupTests';

import StorageController from '../../../../src/controllers/StorageController';

import fs from 'fs';

describe('StorageController', () => {
  let req;
  let res;
  let s3Service;

  beforeEach(() => {
    req = {
      logger: {
        info: sinon.spy(),
        error: sinon.spy()
      },
      file: testFile,
      params: {}
    };
    res = {
      status: () => true,
      send: () => true,
      json: () => true,
      set: () => true
    };

    sinon.stub(res, 'status').returns(res);
    sinon.stub(res, 'send').returns(res);
    sinon.stub(res, 'json').returns(res);
    sinon.stub(res, 'set').returns(res);
  });

  describe('downloadFile()', () => {
    it('should log the correct messages and return a success message when a file is downloaded successfully', (done) => {
      req.params.filename = testFile.originalname;
      s3Service = {
        downloadFile: sinon.stub().returns({Body: 'some body content'})
      };

      const storageController = new StorageController(s3Service);

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

      const storageController = new StorageController(s3Service);

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
    it('should log the correct messages and return a success message when a file is uploaded successfully', (done) => {
      testFile.buffer = fs.createReadStream('test/data/test-file.txt');

      s3Service = {
        uploadFile: sinon.stub().returns({Location: 'http://localhost/a-file'})
      };

      const storageController = new StorageController(s3Service);

      storageController
        .uploadFile(req, res)
        .then(() => {
          expect(req.logger.info).to.have.been.calledTwice;
          expect(req.logger.info).to.have.been.calledWith('Uploading file');
          expect(req.logger.info).to.have.been.calledWith('File uploaded');
          expect(res.status).to.have.been.calledOnce;
          expect(res.status).to.have.been.calledWith(200);
          expect(res.json).to.have.been.calledOnce;
          expect(res.json).to.have.been.calledWith({message: 'File uploaded successfully'});
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should log the correct messages and return an error message when the storage service is not available', (done) => {
      testFile.buffer = fs.createReadStream('test/data/test-file.txt');

      s3Service = {
        uploadFile: sinon.stub().returns(Promise.reject(new Error('Internal Server Error')))
      };

      const storageController = new StorageController(s3Service);

      storageController
        .uploadFile(req, res)
        .then(() => {
          expect(req.logger.info).to.have.been.calledOnce;
          expect(req.logger.info).to.have.been.calledWith('Uploading file');
          expect(req.logger.error).to.have.been.calledTwice;
          expect(req.logger.error).to.have.been.calledWith('Failed to upload file');
          expect(req.logger.error).to.have.been.calledWith('Error: Internal Server Error');
          expect(res.status).to.have.been.calledOnce;
          expect(res.status).to.have.been.calledWith(500);
          expect(res.json).to.have.been.calledOnce;
          expect(res.json).to.have.been.calledWith({error: 'Failed to upload file'});
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
