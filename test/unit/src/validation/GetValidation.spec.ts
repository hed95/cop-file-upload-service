import * as Joi from 'joi';
import GetValidation from '../../../../src/validation/GetValidation';
import {expect} from '../../../setupTests';

interface ITestGetRequest {
  filename: string | string[];
  fileVersion: string;
  processKey: string | string[];
}

describe('GetValidation', () => {
  let data: ITestGetRequest;
  let result: Joi.ValidationResult<ITestGetRequest>;
  let schema: Joi.ObjectSchema;

  beforeEach(() => {
    data = {
      fileVersion: 'orig',
      filename: '9e5eb809-bce7-463e-8c2f-b6bd8c4832d9',
      processKey: 'test-process-key'
    };
    schema = new GetValidation().schema();
  });

  describe('schema()', () => {
    it('should not return an error when the correct data is given', (done) => {
      result = Joi.validate(data, schema);
      expect(result).to.have.property('error').and.equal(null);
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

    it('should return an error when an incorrect value for fileVersion is given', (done) => {
      data.fileVersion = 'original';
      result = Joi.validate(data, schema);
      expect(result).to.have.property('error').and.match(/"fileVersion" must be one of/);
      done();
    });

    it('should return an error when fileVersion is not given', (done) => {
      delete data.fileVersion;
      result = Joi.validate(data, schema);
      expect(result).to.have.property('error').and.match(/"fileVersion" is required/);
      done();
    });

    it('should return an error when filename is not a string', (done) => {
      data.filename = ['9e5eb809-bce7-463e-8c2f-b6bd8c4832d9'];
      result = Joi.validate(data, schema);
      expect(result).to.have.property('error').and.match(/"filename" must be a string/);
      done();
    });

    it('should return an error when an incorrect value for filename is given', (done) => {
      data.filename = 'text-file.txt';
      result = Joi.validate(data, schema);
      expect(result).to.have.property('error').and.match(/"filename" with value "text-file.txt" fails to match the required pattern/);
      done();
    });

    it('should return an error when filename is not given', (done) => {
      delete data.filename;
      result = Joi.validate(data, schema);
      expect(result).to.have.property('error').and.match(/"filename" is required/);
      done();
    });
  });
});
