import * as superagent from 'superagent';
import app from '../../../../src/index';
import IConfig from '../../../../src/interfaces/IConfig';
import {chai, config, expect} from '../../../setupTests';

describe('HealthRouter', () => {
  const {endpoints}: IConfig = config;

  describe('healthCheck()', () => {
    it('should return the correct status and response', (done) => {
      chai
        .request(app)
        .get(endpoints.health)
        .end((err: Error, res: superagent.Response) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.deep.equal({status: 'OK'});
          expect(err).to.equal(null);
          done();
        });
    });
  });

  describe('readinessCheck()', () => {
    it('should return the correct status and response', (done) => {
      chai
        .request(app)
        .get(endpoints.readiness)
        .end((err: Error, res: superagent.Response) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.deep.equal({ready: true});
          expect(err).to.equal(null);
          done();
        });
    });
  });
});
