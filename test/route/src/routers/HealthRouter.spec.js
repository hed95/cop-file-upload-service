import {chai, config, expect} from '../../../setupTests';

import app from '../../../../src/index';

describe('HealthRouter', () => {
  const {endpoints} = config;

  describe('healthCheck()', () => {
    it('should return the correct status and response', done => {
      chai
        .request(app)
        .get(endpoints.health)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.deep.equal({status: 'OK'});
          expect(err).to.equal(null);
          done();
        });
    });
  });

  describe('readinessCheck()', () => {
    it('should return the correct status and response', done => {
      chai
        .request(app)
        .get(endpoints.readiness)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.deep.equal({ready: true});
          expect(err).to.equal(null);
          done();
        });
    });
  });
});
