import {expect, sinon, testFile} from '../../../setupTests';

import Validate from '../../../../src/utils/Validate';

describe('Validate', () => {
  describe('validateFields()', () => {
    it('should validate the fields and return the correct message', done => {
      const rules = {
        schema: sinon.stub().returns({isSchema: true})
      };
      const validator = {
        validate: sinon.stub().returns({error: null})
      };
      const data = {
        file: testFile,
        processKey: 'test-process-key'
      };
      const error = Validate.validateFields(rules, validator, data);

      expect(rules.schema).to.have.been.calledOnce;
      expect(validator.validate).to.have.been.calledOnce;
      expect(validator.validate).to.have.been.calledWith(data, {isSchema: true});
      expect(error).to.be.null;
      done();
    });
  });
});
