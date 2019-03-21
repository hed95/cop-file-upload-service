import {expect, sinon} from '../../../setupTests';

import MetadataController from '../../../../src/controllers/MetadataController';

describe('MetadataController', () => {
  describe('generateMetadata()', () => {
    it('should generate the mertadata', done => {
      const uuid = () => '9e5eb809-bce7-463e-8c2f-b6bd8c4832d9';
      const processedTime = Date.now();
      const req = {
        file: {}
      };
      const res = {};
      const next = sinon.spy();
      const metadataController = new MetadataController(uuid, processedTime);
      metadataController.generateMetadata(req, res, next);
      expect(req).to.deep.equal({
        file: {
          filename: uuid(),
          processedTime: processedTime
        }
      });
      done();
    });
  });
});
