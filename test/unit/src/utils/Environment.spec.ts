import Environment from '../../../../src/utils/Environment';
import {expect} from '../../../setupTests';

describe('Environment', () => {
  describe('notProd()', () => {
    it('should return true when given a value of dev', (done) => {
      const isNotProd: boolean = Environment.isNotProd('dev');
      expect(isNotProd).to.be.true;
      done();
    });

    it('should return true when given a value of test', (done) => {
      const isNotProd: boolean = Environment.isNotProd('test');
      expect(isNotProd).to.be.true;
      done();
    });

    it('should return false when given a value of prod', (done) => {
      const isNotProd: boolean = Environment.isNotProd('prod');
      expect(isNotProd).to.be.false;
      done();
    });

    it('should return false when not given a value', (done) => {
      const isNotProd: boolean = Environment.isNotProd();
      expect(isNotProd).to.be.false;
      done();
    });
  });

  describe('prod()', () => {
    it('should return false when given a value of dev', (done) => {
      const isProd: boolean = Environment.isProd('dev');
      expect(isProd).to.be.false;
      done();
    });

    it('should return false when given a value of test', (done) => {
      const isProd: boolean = Environment.isProd('test');
      expect(isProd).to.be.false;
      done();
    });

    it('should return true when given a value of prod', (done) => {
      const isProd: boolean = Environment.isProd('prod');
      expect(isProd).to.be.true;
      done();
    });

    it('should return true when not given a value', (done) => {
      const isProd: boolean = Environment.isProd();
      expect(isProd).to.be.true;
      done();
    });
  });
});
