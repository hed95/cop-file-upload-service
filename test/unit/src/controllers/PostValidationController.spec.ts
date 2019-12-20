import {NextFunction, Request, Response} from 'express';
import * as Joi from 'joi';
import PostValidationController from '../../../../src/controllers/PostValidationController';
import PostValidation from '../../../../src/validation/PostValidation';
import {expect, requestMock, responseMock, sinon, testFile, validateMock} from '../../../setupTests';

describe('PostValidationController', () => {
  describe('validateRoute()', () => {
    it('should call validate.validateFields() and handleValidation()', (done) => {
      const req: Request = requestMock({
        file: testFile,
        params: {
          businessKey: 'BF-20191218-798'
        }
      });
      const res: Response = responseMock();
      const next: NextFunction = sinon.stub();
      const postValidationController: PostValidationController = new PostValidationController(Joi);

      postValidationController.validate = validateMock;
      const validateStub: sinon.SinonStub = sinon.stub(postValidationController.validate, 'validateFields').returns(null);
      postValidationController.handleValidation = sinon.spy();

      postValidationController.validateRoute(req, res, next);

      expect(postValidationController.validate.validateFields).to.have.been.calledOnce;
      expect(postValidationController.validate.validateFields).to.have.been.calledWith(new PostValidation(), Joi, {
        businessKey: 'BF-20191218-798',
        file: testFile
      });
      expect(postValidationController.handleValidation).to.have.been.calledOnce;
      expect(postValidationController.handleValidation).to.have.been.calledWith(req, res, next, null);

      validateStub.restore();

      done();
    });
  });
});
