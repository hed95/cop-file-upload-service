import * as Joi from 'joi';
import GetFileValidation from '../../../../src/validation/GetFileValidation';
import {expect} from '../../../setupTests';

interface ITestGetRequest {
  filename: string | string[];
  fileVersion: string;
  businessKey: string | string[];
}

describe('GetFileValidation', () => {
  let data: ITestGetRequest;
  let result: Joi.ValidationResult<ITestGetRequest>;
  let schema: Joi.ObjectSchema;

  beforeEach(() => {
    data = {
      businessKey: 'BF-20191218-798',
      fileVersion: 'orig',
      filename: '9e5eb809-bce7-463e-8c2f-b6bd8c4832d9'
    };
    schema = new GetFileValidation().schema();
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
