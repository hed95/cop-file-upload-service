import {chai, config, expect, nock, testFile} from '../../../setupTests';

import GetValidation from '../../../../src/validation/GetValidation';

import app from '../../../../src/index';
import fs from 'fs';

describe('FilesRouter', () => {
  const processKey = 'test-process-key';
  const {endpoints, fileVersions, services} = config;
  let filename;

  describe('post()', () => {
    const postUrl = `${endpoints.files}/${processKey}`;
    let virusScanMock;

    beforeEach(() => {
      const {virusScan} = services;
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
        .post(postUrl)
        .attach(testFile.fieldname, testFile.buffer, testFile.originalname)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('url');
          expect(res.body).to.have.property('name');
          expect(res.body).to.have.property('size');
          expect(res.body).to.have.property('processedTime');

          filename = res.body.url.split('/')[2];

          expect(filename).to.match(new GetValidation().filenameRegex);
          expect(res.body.url).to.match(new RegExp(`/${fileVersions.clean}/`));
          expect(res.body.name).to.equal(testFile.originalname);
          expect(res.body.size).to.equal(testFile.size);
          expect(err).to.equal(null);
          done();
        });
    });

    it('should return the correct status and response when incorrect data is given', done => {
      virusScanMock.reply(200, 'true');

      chai
        .request(app)
        .post(postUrl)
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
        .post('/uploads')
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
        .post(postUrl)
        .attach(testFile.fieldname, testFile.buffer, testFile.originalname)
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
        .get(`${endpoints.files}/${processKey}/${fileVersions.original}/${filename}`)
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
        .get(`${endpoints.files}/does-not-exist.txt`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.deep.equal({error: 'Route not found'});
          expect(err).to.equal(null);
          done();
        });
    });
  });

  describe('delete()', () => {
    it('should return the correct status and response', done => {
      chai
        .request(app)
        .delete(`${endpoints.files}/${processKey}/${filename}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.deep.equal({message: 'Files deleted successfully'});
          expect(err).to.equal(null);
          done();
        });
    });

    it('should return the correct status and response when the route is not found', done => {
      chai
        .request(app)
        .delete(`${endpoints.files}/${processKey}`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.deep.equal({error: 'Route not found'});
          expect(err).to.equal(null);
          done();
        });
    });
  });
});
