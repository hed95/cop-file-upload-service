import {expect, sinon, testFile} from '../../../setupTests';

import ValidationController from '../../../../src/controllers/ValidationController';

describe('ValidationController', () => {
  describe('validatePost()', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
      req = {
        logger: {
          error: sinon.spy(),
          info: sinon.spy()
        },
        method: 'POST'
      };
      res = {
        status: () => true,
        json: () => true
      };
      next = sinon.spy();

      sinon.stub(res, 'status').returns(res);
      sinon.stub(res, 'json').returns(res);
    });

    it('should log the correct message and return an error when a file is not given', (done) => {
      const validationMiddleware = new ValidationController();

      validationMiddleware.validatePost(req, res, next);

      expect(req.logger.error).to.have.been.calledTwice;
      expect(req.logger.error).to.have.been.calledWith('POST validation failed');
      expect(req.logger.error).to.have.been.calledWith('"file" is required');
      expect(res.status).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledWith(400);
      expect(res.json).to.have.been.calledOnce;
      expect(res.json).to.have.been.calledWith({error: '"file" is required'});
      done();
    });

    it('should log the correct message and call next() when a file is given', (done) => {
      req.file = testFile;

      const validationMiddleware = new ValidationController();

      validationMiddleware.validatePost(req, res, next);

      expect(req.logger.info).to.have.been.calledOnce;
      expect(req.logger.info).to.have.been.calledWith('POST validation passed');
      expect(next).to.have.been.calledOnce;
      done();
    });
  });
});
