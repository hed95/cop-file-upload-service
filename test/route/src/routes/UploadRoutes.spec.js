import {chai, config, expect, nock, testFile} from '../../../setupTests';

import app from '../../../../index';
import fs from 'fs';

describe('UploadRoutes', () => {
  describe('get()', () => {
    it('should return the correct status and response', (done) => {
      chai
        .request(app)
        .get('/uploads/test-file.txt')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('Body');
          expect(err).to.equal(null);
          done();
        });
    });
  });

  describe('post()', () => {
    let virusScanMock;

    beforeEach(() => {
      const {virusScan} = config.services;
      virusScanMock = nock(`${virusScan.url}:${virusScan.port}`).post(virusScan.path);

      testFile.buffer = fs.createReadStream('test/data/test-file.txt');
    });

    afterEach(() => {
      nock.restore();
    });

    it('should return the correct status and response when a file is given', (done) => {
      virusScanMock.reply(200, 'true');

      chai
        .request(app)
        .post('/uploads')
        .attach(testFile.fieldname, testFile.buffer, testFile.originalname)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.deep.equal({message: 'File uploaded successfully'});
          expect(err).to.equal(null);
          done();
        });
    });

    it('should return the correct status and response when a file is not given', (done) => {
      virusScanMock.reply(200, 'true');

      chai
        .request(app)
        .post('/uploads')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.deep.equal({error: '"file" is required'});
          expect(err).to.equal(null);
          done();
        });
    });

    it('should return the correct status and response when the virus scanning service is not available', (done) => {
      virusScanMock.reply(500, 'Internal Server Error');

      chai
        .request(app)
        .post('/uploads')
        .attach(testFile.fieldname, testFile.buffer, testFile.originalname)
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.body).to.deep.equal({error: 'Unable to call the virus scanning service'});
          expect(err).to.equal(null);
          done();
        });
    });
  });
});
