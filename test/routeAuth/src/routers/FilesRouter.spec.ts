import * as fs from 'fs';
import * as superagent from 'superagent';
import app from '../../../../src/index';
import {chai, config, expect, testFile} from '../../../setupTests';

describe('FilesRouter', () => {
  const processKey: string = 'test-process-key';
  const filename: string = 'c0569d57-59a0-4c39-8379-03e5a261f954';

  describe('get()', () => {
    it('should return the correct status and response when authentication fails', (done) => {
      chai
        .request(app)
        .get(`${config.endpoints.files}/${processKey}/${config.fileVersions.original}/${filename}`)
        .end((err: Error, res: superagent.Response) => {
          expect(res.status).to.equal(403);
          expect(res.text).to.equal('Access denied');
          expect(err).to.equal(null);
          done();
        });
    });
  });

  describe('post()', () => {
    it('should return the correct status and response when authentication fails', (done) => {
      testFile.buffer = new Buffer(fs.readFileSync('test/data/test-file.txt'));
      chai
        .request(app)
        .post(config.endpoints.files)
        .attach(testFile.fieldname, testFile.buffer, testFile.originalname)
        .field('processKey', processKey)
        .end((err: Error, res: superagent.Response) => {
          expect(res.status).to.equal(403);
          expect(res.text).to.equal('Access denied');
          expect(err).to.equal(null);
          done();
        });
    });
  });

  describe('delete()', () => {
    it('should return the correct status and response when authentication fails', (done) => {
      chai
        .request(app)
        .get(`${config.endpoints.files}/${processKey}/${filename}`)
        .end((err: Error, res: superagent.Response) => {
          expect(res.status).to.equal(403);
          expect(res.text).to.equal('Access denied');
          expect(err).to.equal(null);
          done();
        });
    });
  });
});
