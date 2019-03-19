import {chai, config, expect, testFile} from '../../../setupTests';

import app from '../../../../src/index';
import fs from 'fs';

describe('FilesRouter', () => {
  describe('get()', () => {
    it('should return the correct status and response when authentication fails', done => {
      chai
        .request(app)
        .get(`${config.endpoints.files}/test-process-key/orig/c0569d57-59a0-4c39-8379-03e5a261f954`)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.text).to.equal('Access denied');
          expect(err).to.equal(null);
          done();
        });
    });
  });

  describe('post()', () => {
    it('should return the correct status and response when authentication fails', done => {
      testFile.buffer = fs.createReadStream('test/data/test-file.txt');
      chai
        .request(app)
        .post(config.endpoints.files)
        .attach(testFile.fieldname, testFile.buffer, testFile.originalname)
        .field('processKey', 'test-process-key')
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.text).to.equal('Access denied');
          expect(err).to.equal(null);
          done();
        });
    });
  });
});
