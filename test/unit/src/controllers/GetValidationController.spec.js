import {expect, sinon, validateMock} from '../../../setupTests';

import GetValidation from '../../../../src/validation/GetValidation';
import GetValidationController from '../../../../src/controllers/GetValidationController';
import Joi from 'joi';

describe('GetValidationController', () => {
  describe('validateRoute()', () => {
    it('should call validate.validateFields() and handleValidation()', done => {
      const req = {
        params: {
          processKey: 'test-process-key',
          fileVersion: 'orig',
          filename: '9e5eb809-bce7-463e-8c2f-b6bd8c4832d9'
        }
      };
      const res = {};
      const next = {};
      const getValidationController = new GetValidationController(Joi);

      getValidationController.validate = validateMock;
      const validateStub = sinon.stub(getValidationController.validate, 'validateFields').returns(null);
      getValidationController.handleValidation = sinon.spy();

      getValidationController.validateRoute(req, res, next);

      expect(getValidationController.validate.validateFields).to.have.been.calledOnce;
      expect(getValidationController.validate.validateFields).to.have.been.calledWith(new GetValidation(), Joi, req.params);
      expect(getValidationController.handleValidation).to.have.been.calledOnce;
      expect(getValidationController.handleValidation).to.have.been.calledWith(req, res, next, null);

      validateStub.restore();

      done();
    });
  });
});
