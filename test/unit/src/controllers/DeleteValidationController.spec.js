import {expect, sinon, validateMock} from '../../../setupTests';

import DeleteValidation from '../../../../src/validation/DeleteValidation';
import DeleteValidationController from '../../../../src/controllers/DeleteValidationController';
import Joi from 'joi';

describe('DeleteValidationController', () => {
  describe('validateRoute()', () => {
    it('should call validate.validateFields() and handleValidation()', done => {
      const req = {
        params: {
          processKey: 'test-process-key',
          filename: '9e5eb809-bce7-463e-8c2f-b6bd8c4832d9'
        }
      };
      const res = {};
      const next = {};
      const deleteValidationController = new DeleteValidationController(Joi);

      deleteValidationController.validate = validateMock;
      const validateStub = sinon.stub(deleteValidationController.validate, 'validateFields').returns(null);
      deleteValidationController.handleValidation = sinon.spy();

      deleteValidationController.validateRoute(req, res, next);

      expect(deleteValidationController.validate.validateFields).to.have.been.calledOnce;
      expect(deleteValidationController.validate.validateFields).to.have.been.calledWith(new DeleteValidation(), Joi, req.params);
      expect(deleteValidationController.handleValidation).to.have.been.calledOnce;
      expect(deleteValidationController.handleValidation).to.have.been.calledWith(req, res, next, null);

      validateStub.restore();

      done();
    });
  });
});
