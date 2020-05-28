import Validation from '../../../../src/validation/Validation';
import {expect} from '../../../setupTests';

describe('Validation', () => {
  describe('class variables', () => {
    it('should set the correct values', (done) => {
      const validation = new Validation();
      expect(validation.filenamePattern).to.equal('([a-f0-9]{4,}-){4}[a-f0-9]{4,}');
      expect(validation.filenameRegex).to.deep.equal(new RegExp('^([a-f0-9]{4,}-){4}[a-f0-9]{4,}$'));
      expect(validation.joi).to.have.property('isJoi').and.to.be.true;
      done();
    });
  });

  describe('extendedJoi()', () => {
    it('should return an extended joi instance', (done) => {
      const validation = new Validation();
      const extendedJoi = validation.extendedJoi();
      expect(extendedJoi).to.have.property('isJoi').and.to.be.true;
      expect(extendedJoi).to.have.property('_binds').and.to.include('fileType');
      done();
    });
  });
});
