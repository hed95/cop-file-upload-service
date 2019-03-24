import {ValidationError} from 'joi';
import PostRequestInterface from '../../../../src/interfaces/IPostRequestParams';
import Validate from '../../../../src/utils/Validate';
import {expect, sinon, testFile} from '../../../setupTests';

describe('Validate', () => {
  describe('validateFields()', () => {
    it('should validate the fields and return the correct message', (done) => {
      const rules: any = {
        schema: sinon.stub().returns({isSchema: true})
      };
      const validator: any = {
        validate: sinon.stub().returns({error: null})
      };
      const data: PostRequestInterface = {
        file: testFile,
        processKey: 'test-process-key'
      };
      const error: ValidationError | null = new Validate().validateFields(rules, validator, data);

      expect(rules.schema).to.have.been.calledOnce;
      expect(validator.validate).to.have.been.calledOnce;
      expect(validator.validate).to.have.been.calledWith(data, {isSchema: true});
      expect(error).to.be.null;
      done();
    });
  });
});
