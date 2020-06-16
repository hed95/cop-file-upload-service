import * as fs from 'fs';
import * as Joi from 'joi';
import PostValidation from '../../../../src/validation/PostValidation';
import {config, expect} from '../../../setupTests';

interface ITestPostRequest {
  file: any;
  businessKey: string | string[];
}

describe('PostValidation', () => {
  let data: ITestPostRequest;
  let result: Joi.ValidationResult<ITestPostRequest>;
  let schema: Joi.ObjectSchema;
  const validFileTypes: string = Object.keys(config.validFileTypes).join(', ');

  beforeEach(() => {
    data = {
      businessKey: 'BF-20191218-798',
      file: {
        buffer: fs.readFileSync('test/data/test-file.pdf'),
        encoding: '7bit',
        fieldname: 'file',
        mimetype: 'application/pdf',
        originalname: 'test-file.pdf',
        size: 100
      }
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

    it('should return an error when file buffer has an invalid mime type', (done) => {
      data.file.mimetype = 'text/plain';
      result = Joi.validate(data, schema);
      expect(result).to.have.property('error').and.match(new RegExp(`"buffer" file type is invalid, valid formats are: ${validFileTypes}`));
      done();
    });

    it('should return an error when file buffer has an invalid hex signature', (done) => {
      data.file.buffer = fs.readFileSync('test/data/invalid-file-with-valid-ext.pdf');
      result = Joi.validate(data, schema);
      expect(result).to.have.property('error').and.match(new RegExp(`"buffer" file type is invalid, valid formats are: ${validFileTypes}`));
      done();
    });

    it('should return an error when file buffer is not given', (done) => {
      delete data.file.buffer;
      result = Joi.validate(data, schema);
      expect(result).to.have.property('error').and.match(/"buffer" is required/);
      done();
    });

    it('should return an error when file encoding is not valid', (done) => {
      data.file.encoding = 7;
      result = Joi.validate(data, schema);
      expect(result).to.have.property('error').and.match(/"encoding" must be a string/);
      done();
    });

    it('should return an error when file encoding is not given', (done) => {
      delete data.file.encoding;
      result = Joi.validate(data, schema);
      expect(result).to.have.property('error').and.match(/"encoding" is required/);
      done();
    });

    it('should return an error when file fieldname is not valid', (done) => {
      data.file.fieldname = {fieldname: 'file'};
      result = Joi.validate(data, schema);
      expect(result).to.have.property('error').and.match(/"fieldname" must be a string/);
      done();
    });

    it('should return an error when file fieldname is not given', (done) => {
      delete data.file.fieldname;
      result = Joi.validate(data, schema);
      expect(result).to.have.property('error').and.match(/"fieldname" is required/);
      done();
    });

    it('should return an error when file mimetype is not valid', (done) => {
      data.file.mimetype = {mimetype: 'application/pdf'};
      result = Joi.validate(data, schema);
      expect(result).to.have.property('error').and.match(new RegExp(`"buffer" file type is invalid, valid formats are: ${validFileTypes}`));
      done();
    });

    it('should return an error when file mimetype is not given', (done) => {
      delete data.file.mimetype;
      result = Joi.validate(data, schema);
      expect(result).to.have.property('error').and.match(new RegExp(`"buffer" file type is invalid, valid formats are: ${validFileTypes}`));
      done();
    });

    it('should return an error when file originalname is not valid', (done) => {
      data.file.originalname = {originalname: 'test-file.pdf'};
      result = Joi.validate(data, schema);
      expect(result).to.have.property('error').and.match(/"originalname" must be a string/);
      done();
    });

    it('should return an error when file originalname is not given', (done) => {
      delete data.file.originalname;
      result = Joi.validate(data, schema);
      expect(result).to.have.property('error').and.match(/"originalname" is required/);
      done();
    });

    it('should return an error when file size is not valid', (done) => {
      data.file.size = {size: 100};
      result = Joi.validate(data, schema);
      expect(result).to.have.property('error').and.match(/"size" must be a number/);
      done();
    });

    it('should return an error when file size is greater than the max size', (done) => {
      data.file.size = config.fileSizeLimitInBytes + 1;
      result = Joi.validate(data, schema);
      expect(result).to.have.property('error').and.match(/"size" must be less than or equal to 25000000/);
      done();
    });

    it('should return an error when file size is not given', (done) => {
      delete data.file.size;
      result = Joi.validate(data, schema);
      expect(result).to.have.property('error').and.match(/"size" is required/);
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
