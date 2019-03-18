import {expect, sinon} from '../../../setupTests';

import ValidationController from '../../../../src/controllers/ValidationController';

describe('ValidationController', () => {
  let req;
  let res;
  let next;
  let joi;

  beforeEach(() => {
    req = {
      logger: {
        error: sinon.spy(),
        info: sinon.spy()
      },
      method: 'POST',
      body: {}
    };
    res = {
      status: () => true,
      json: () => true
    };
    next = sinon.spy();
    joi = {
      validate: sinon.stub().returns({
        error: null
      })
    };

    sinon.stub(res, 'status').returns(res);
    sinon.stub(res, 'json').returns(res);
  });

  describe('validate()', () => {
    it('should log the correct messages and call next()', done => {
      const validationController = new ValidationController();

      validationController.validateRoute(req, res, next);

      expect(req.logger.error).to.have.been.calledOnce;
      expect(req.logger.error).to.have.been.calledWith('POST validation is not configured');
      expect(next).to.have.been.calledOnce;
      done();
    });
  });

  describe('handleValidation()', () => {
    it('should log the correct messages and call next() if there is no error', done => {
      const error = null;
      const validationController = new ValidationController(joi);
      validationController.handleValidation(req, res, next, error);

      expect(req.logger.info).to.have.been.calledOnce;
      expect(req.logger.info).to.have.been.calledWith('POST validation passed');
      expect(next).to.have.been.calledOnce;
      done();
    });

    it('should log the correct messages and return the correct status and message if there is an error', done => {
      const error = {
        details: [{
          message: '"processKey" is required'
        }]
      };
      const validationController = new ValidationController(joi);
      validationController.handleValidation(req, res, next, error);

      expect(req.logger.error).to.have.been.calledTwice;
      expect(req.logger.error).to.have.been.calledWith('POST validation failed');
      expect(req.logger.error).to.have.been.calledWith(error.details[0].message);
      expect(res.status).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledWith(400);
      expect(res.json).to.have.been.calledOnce;
      expect(res.json).to.have.been.calledWith({error: error.details[0].message});
      done();
    });
  });
});
