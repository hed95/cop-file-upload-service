import {NextFunction, Request, Response} from 'express';
import * as Joi from 'joi';
import ValidationController from '../../../../src/controllers/ValidationController';
import PostValidation from '../../../../src/validation/PostValidation';
import {expect, requestMock, responseMock, sinon} from '../../../setupTests';

describe('ValidationController', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;
  let joi: any;
  let validationController: ValidationController;

  beforeEach(() => {
    req = requestMock({
      body: {},
      logger: sinon.spy(),
      method: 'POST'
    });
    res = responseMock();
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
    it('should log the correct messages and call next()', (done) => {
      validationController = new ValidationController(joi);

      validationController.validateRoute(req, res, next);

      expect(req.logger).to.have.been.calledOnce;
      expect(req.logger).to.have.been.calledWith('POST validation is not configured');
      expect(next).to.have.been.calledOnce;
      done();
    });
  });

  describe('handleValidation()', () => {
    it('should log the correct messages and call next() if there is no error', (done) => {
      const error = null;
      validationController = new ValidationController(joi);
      validationController.handleValidation(req, res, next, error);

      expect(req.logger).to.have.been.calledOnce;
      expect(req.logger).to.have.been.calledWith('POST validation passed');
      expect(next).to.have.been.calledOnce;
      done();
    });

    it('should log the correct messages and return the correct status and message if there is an error', (done) => {
      const schema: Joi.ObjectSchema = new PostValidation().schema();
      const result: Joi.ValidationResult<object> = Joi.validate({}, schema);

      validationController = new ValidationController(joi);
      validationController.handleValidation(req, res, next, result.error);

      expect(req.logger).to.have.been.calledTwice;
      expect(req.logger).to.have.been.calledWith('POST validation failed');
      expect(req.logger).to.have.been.calledWith(result.error.details[0].message);
      expect(res.status).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledWith(400);
      expect(res.json).to.have.been.calledOnce;
      expect(res.json).to.have.been.calledWith({error: result.error.details[0].message});
      done();
    });
  });
});
