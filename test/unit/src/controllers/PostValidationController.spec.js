import {expect, sinon, testFile, validateMock} from '../../../setupTests';

import Joi from 'joi';
import PostValidation from '../../../../src/validation/PostValidation';
import PostValidationController from '../../../../src/controllers/PostValidationController';

describe('PostValidationController', () => {
  describe('validateRoute()', () => {
    it('should call validate.validateFields() and handleValidation()', done => {
      const req = {
        file: testFile,
        body: {
          processKey: 'test-process-key'
        }
      };
      const res = {};
      const next = {};
      const postValidationController = new PostValidationController(Joi);

      postValidationController.validate = validateMock;
      const validateStub = sinon.stub(postValidationController.validate, 'validateFields').returns(null);
      postValidationController.handleValidation = sinon.spy();

      postValidationController.validateRoute(req, res, next);

      expect(postValidationController.validate.validateFields).to.have.been.calledOnce;
      expect(postValidationController.validate.validateFields).to.have.been.calledWith(new PostValidation(), Joi, {
        file: testFile,
        processKey: 'test-process-key'
      });
      expect(postValidationController.handleValidation).to.have.been.calledOnce;
      expect(postValidationController.handleValidation).to.have.been.calledWith(req, res, next, null);

      validateStub.restore();

      done();
    });
  });
});
