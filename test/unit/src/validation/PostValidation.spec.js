import Joi from 'joi';
import PostValidation from '../../../../src/validation/PostValidation';

import {expect} from '../../../setupTests';

describe('PostValidation', () => {
  describe('schema()', () => {
    it('should not return an error when a file is given', (done) => {
      const result = Joi.validate({file: 'afile'}, new PostValidation().schema());
      expect(result).to.have.property('error').and.equal(null);
      done();
    });

    it('should return an error when a file is not given', (done) => {
      const result = Joi.validate({}, new PostValidation().schema());
      expect(result).to.have.property('error').and.match(/"file" is required/);
      done();
    });

    it('should return an error when an object is not given', (done) => {
      const result = Joi.validate('afile', new PostValidation().schema());
      expect(result).to.have.property('error').and.match(/"value" must be an object/);
      done();
    });
  });
});
