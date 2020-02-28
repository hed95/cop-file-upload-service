import * as Joi from 'joi';
import GetFilesValidation from '../../../../src/validation/GetFilesValidation';
import {expect} from '../../../setupTests';

interface ITestGetRequest {
  businessKey: string | string[];
}

describe('GetFilesValidation', () => {
  let data: ITestGetRequest;
  let result: Joi.ValidationResult<ITestGetRequest>;
  let schema: Joi.ObjectSchema;

  beforeEach(() => {
    data = {
      businessKey: 'BF-20191218-798'
    };
    schema = new GetFilesValidation().schema();
  });

  describe('schema()', () => {
    it('should not return an error when the correct data is given', (done) => {
      result = Joi.validate(data, schema);
      expect(result).to.have.property('error').and.equal(null);
      done();
    });

    it('should return an error when businessKey is not a string', (done) => {
      data.businessKey = ['BF-20191218-798'];
      result = Joi.validate(data, schema);
      expect(result).to.have.property('error').and.match(/"businessKey" must be a string/);
      done();
    });

    it('should return an error when businessKey is not given', (done) => {
      delete data.businessKey;
      result = Joi.validate(data, schema);
      expect(result).to.have.property('error').and.match(/"businessKey" is required/);
      done();
    });
  });
});
