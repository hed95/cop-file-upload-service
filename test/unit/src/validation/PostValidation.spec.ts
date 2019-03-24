import * as Joi from 'joi';
import PostValidation from '../../../../src/validation/PostValidation';
import {expect, testFile} from '../../../setupTests';

interface ITestPostRequest {
  file: Express.Multer.File | string;
  processKey: string | string[];
}

describe('PostValidation', () => {
  let data: ITestPostRequest;
  let result: Joi.ValidationResult<ITestPostRequest>;
  let schema: Joi.ObjectSchema;

  beforeEach(() => {
    data = {
      file: testFile,
      processKey: 'test-process-key'
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

    it('should return an error when processKey is not a string', (done) => {
      data.processKey = ['test-process-key'];
      result = Joi.validate(data, schema);
      expect(result).to.have.property('error').and.match(/"processKey" must be a string/);
      done();
    });

    it('should return an error when processKey is not given', (done) => {
      delete data.processKey;
      result = Joi.validate(data, schema);
      expect(result).to.have.property('error').and.match(/"processKey" is required/);
      done();
    });
  });
});
