import Joi from 'joi';
import PostValidation from '../../../../src/validation/PostValidation';

import {expect} from '../../../setupTests';

describe('PostValidation', () => {
  describe('schema()', () => {
    it('should not return an error when the correct data is given', (done) => {
      const data = {
        file: {},
        processKey: 'test-process-key'
      };
      const result = Joi.validate(data, new PostValidation().schema());
      expect(result).to.have.property('error').and.equal(null);
      done();
    });

    it('should return an error when a file is not given', (done) => {
      const data = {
        processKey: 'test-process-key'
      };
      const result = Joi.validate(data, new PostValidation().schema());
      expect(result).to.have.property('error').and.match(/"file" is required/);
      done();
    });

    it('should return an error when a file is not an object', (done) => {
      const data = {
        file: 'test-file'
      };
      const result = Joi.validate(data, new PostValidation().schema());
      expect(result).to.have.property('error').and.match(/"file" must be an object/);
      done();
    });

    it('should return an error when a processKey is not given', (done) => {
      const data = {
        file: {},
      };
      const result = Joi.validate(data, new PostValidation().schema());
      expect(result).to.have.property('error').and.match(/"processKey" is required/);
      done();
    });

    it('should return an error when a processKey is not a string', (done) => {
      const data = {
        file: {},
        processKey: ['test-process-key']
      };
      const result = Joi.validate(data, new PostValidation().schema());
      expect(result).to.have.property('error').and.match(/"processKey" must be a string/);
      done();
    });
  });
});
