import {config, expect, sinon, testFile} from '../../../setupTests';

import PostResponseController from '../../../../src/controllers/PostResponseController';

describe('PostResponseController', () => {
  describe('response()', () => {
    it('should return the correct response', done => {
      const req = {
        file: testFile,
        params: {
          processKey: 'test-process-key'
        },
        logger: {
          info: sinon.spy()
        }
      };
      const res = {
        status: () => true,
        json: () => true
      };

      req.file.filename = '9e5eb809-bce7-463e-8c2f-b6bd8c4832d9';

      sinon.stub(res, 'status').returns(res);
      sinon.stub(res, 'json').returns(res);

      const postResponseController = new PostResponseController(config);

      postResponseController.response(req, res);

      expect(res.status).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledOnce;
      expect(res.json).to.have.been.calledWith({
        url: `/${config.fileVersions.clean}/${testFile.filename}`,
        name: testFile.originalname,
        size: testFile.size
      });

      done();
    });
  });
});
