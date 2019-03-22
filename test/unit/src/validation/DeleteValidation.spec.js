import DeleteValidation from '../../../../src/validation/DeleteValidation';
import Joi from 'joi';

import {expect} from '../../../setupTests';

describe('DeleteValidation', () => {
  let data;

  beforeEach(() => {
    data = {
      processKey: 'test-process-key',
      filename: '9e5eb809-bce7-463e-8c2f-b6bd8c4832d9'
    };
  });

  describe('schema()', () => {
    it('should not return an error when the correct data is given', done => {
      const result = Joi.validate(data, new DeleteValidation().schema());
      expect(result).to.have.property('error').and.equal(null);
      done();
    });

    it('should return an error when processKey is not a string', done => {
      data.processKey = ['test-process-key'];
      const result = Joi.validate(data, new DeleteValidation().schema());
      expect(result).to.have.property('error').and.match(/"processKey" must be a string/);
      done();
    });

    it('should return an error when processKey is not given', done => {
      delete data.processKey;
      const result = Joi.validate(data, new DeleteValidation().schema());
      expect(result).to.have.property('error').and.match(/"processKey" is required/);
      done();
    });

    it('should return an error when filename is not a string', done => {
      data.filename = ['9e5eb809-bce7-463e-8c2f-b6bd8c4832d9'];
      const result = Joi.validate(data, new DeleteValidation().schema());
      expect(result).to.have.property('error').and.match(/"filename" must be a string/);
      done();
    });

    it('should return an error when an incorrect value for filename is given', done => {
      data.filename = 'text-file.txt';
      const result = Joi.validate(data, new DeleteValidation().schema());
      expect(result).to.have.property('error').and.match(/"filename" with value "text-file.txt" fails to match the required pattern/);
      done();
    });

    it('should return an error when filename is not given', done => {
      delete data.filename;
      const result = Joi.validate(data, new DeleteValidation().schema());
      expect(result).to.have.property('error').and.match(/"filename" is required/);
      done();
    });
  });
});
