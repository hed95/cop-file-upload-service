import {expect, sinon} from '../../../setupTests';

import FilenameController from '../../../../src/controllers/FilenameController';

describe('FilenameController', () => {
  describe('generateFilename()', () => {
    it('should generate a filename', (done) => {
      const uuid = () => '9e5eb809-bce7-463e-8c2f-b6bd8c4832d9';
      const req = {
        file: {}
      };
      const res = {};
      const next = sinon.spy();
      const filenameController = new FilenameController(uuid);
      filenameController.generateFilename(req, res, next);
      expect(req).to.deep.equal({file: {filename: uuid()}});
      done();
    });
  });
});
