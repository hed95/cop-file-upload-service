import * as Joi from 'joi';
import PostValidation from '../../../../src/validation/PostValidation';
import {expect, testFile} from '../../../setupTests';

interface ITestPostRequest {
  file: Express.Multer.File | string;
  businessKey: string | string[];
}

describe('PostValidation', () => {
  let data: ITestPostRequest;
  let result: Joi.ValidationResult<ITestPostRequest>;
  let schema: Joi.ObjectSchema;

  beforeEach(() => {
    data = {
      businessKey: 'BF-20191218-798',
      file: testFile
    };
    schema = new PostValidation().schema();
  });

  describe('schema()', () => {
    it('should not return an error when the correct data is given', (done) => {
      result = Joi.validate(data, schema);
      expect(result).to.have.property('error').and.equal(null);
      done();
    });

    it('should return an error when file is not an object', (done) => {
      data.file = 'test-file';
      result = Joi.validate(data, schema);
      expect(result).to.have.property('error').and.match(/"file" must be an object/);
      done();
    });

    it('should return an error when file is not given', (done) => {
      delete data.file;
      result = Joi.validate(data, schema);
      expect(result).to.have.property('error').and.match(/"file" is required/);
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
