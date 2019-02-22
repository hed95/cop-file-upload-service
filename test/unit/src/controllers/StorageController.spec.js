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
        error: () => true
      },
      file: testFile,
      params: {}
    };
    res = {
      status: () => true,
      json: () => true
    };

    sinon.stub(res, 'status').returns(res);
    sinon.stub(res, 'json').returns(res);
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
          expect(req.logger.info).to.have.been.calledWith(`Downloading file: ${testFile.originalname}`);
          expect(req.logger.info).to.have.been.calledWith('File downloaded');
          expect(res.status).to.have.been.calledOnce;
          expect(res.status).to.have.been.calledWith(200);
          expect(res.json).to.have.been.calledOnce;
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
          expect(res.json).to.have.been.calledWith({
            location: 'http://localhost/a-file'
          });
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});