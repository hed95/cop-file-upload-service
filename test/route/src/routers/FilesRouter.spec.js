import {chai, config, expect, nock, testFile} from '../../../setupTests';

import GetValidation from '../../../../src/validation/GetValidation';

import app from '../../../../src/index';
import fs from 'fs';

describe('FilesRouter', () => {
  let filename;

  describe('post()', () => {
    let virusScanMock;

    beforeEach(() => {
      const {virusScan} = config.services;
      virusScanMock = nock(`http://${virusScan.host}:${virusScan.port}`).post(virusScan.path);

      testFile.buffer = fs.createReadStream('test/data/test-file.txt');
    });

    afterEach(() => {
      nock.restore();
    });

    it('should return the correct status and response when the correct data is given', done => {
      virusScanMock.reply(200, 'true');

      chai
        .request(app)
        .post(config.endpoints.files)
        .attach(testFile.fieldname, testFile.buffer, testFile.originalname)
        .field('processKey', 'test-process-key')
        .end((err, res) => {
          filename = res.body.filename;
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('filename');
          expect(res.body.filename).to.match(new GetValidation().filenameRegex);
          expect(err).to.equal(null);
          done();
        });
    });

    it('should return the correct status and response when incorrect data is given', done => {
      virusScanMock.reply(200, 'true');

      chai
        .request(app)
        .post(config.endpoints.files)
        .field('processKey', 'test-process-key')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.deep.equal({error: '"file" is required'});
          expect(err).to.equal(null);
          done();
        });
    });

    it('should return the correct status and response when the route is not found', done => {
      chai
        .request(app)
        .post('/uploadz')
        .attach(testFile.fieldname, testFile.buffer, testFile.originalname)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.deep.equal({error: 'Route not found'});
          expect(err).to.equal(null);
          done();
        });
    });

    it('should return the correct status and response when the virus scanning service is not available', done => {
      virusScanMock.reply(500, 'Internal Server Error');

      chai
        .request(app)
        .post(config.endpoints.files)
        .attach(testFile.fieldname, testFile.buffer, testFile.originalname)
        .field('processKey', 'test-process-key')
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.body).to.deep.equal({error: 'Unable to call the virus scanning service'});
          expect(err).to.equal(null);
          done();
        });
    });
  });

  describe('get()', () => {
    it('should return the correct status and response', done => {
      chai
        .request(app)
        .get(`${config.endpoints.files}/test-process-key/orig/${filename}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.get('Content-Type')).to.equal('text/plain; charset=utf-8');
          expect(err).to.equal(null);
          done();
        });
    });

    it('should return the correct status and response when the route is not found', done => {
      chai
        .request(app)
        .get(`${config.endpoints.files}/does-not-exist.txt`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.deep.equal({error: 'Route not found'});
          expect(err).to.equal(null);
          done();
        });
    });
  });
});
