import {expect, testFile} from '../../../setupTests';

import Joi from 'joi';
import PostValidation from '../../../../src/validation/PostValidation';

describe('PostValidation', () => {
  let data;

  beforeEach(() => {
    data = {
      file: testFile,
      processKey: 'test-process-key'
    };
  });

  describe('schema()', () => {
    it('should not return an error when the correct data is given', done => {
      const result = Joi.validate(data, new PostValidation().schema());
      expect(result).to.have.property('error').and.equal(null);
      done();
    });

    it('should return an error when file is not an object', done => {
      data.file = 'test-file';
      const result = Joi.validate(data, new PostValidation().schema());
      expect(result).to.have.property('error').and.match(/"file" must be an object/);
      done();
    });

    it('should return an error when file is not given', done => {
      delete data.file;
      const result = Joi.validate(data, new PostValidation().schema());
      expect(result).to.have.property('error').and.match(/"file" is required/);
      done();
    });

    it('should return an error when processKey is not a string', done => {
      data.processKey = ['test-process-key'];
      const result = Joi.validate(data, new PostValidation().schema());
      expect(result).to.have.property('error').and.match(/"processKey" must be a string/);
      done();
    });

    it('should return an error when processKey is not given', done => {
      delete data.processKey;
      const result = Joi.validate(data, new PostValidation().schema());
      expect(result).to.have.property('error').and.match(/"processKey" is required/);
      done();
    });
  });
});
