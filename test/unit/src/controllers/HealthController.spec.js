import {expect, sinon} from '../../../setupTests';

import HealthController from '../../../../src/controllers/HealthController';

describe('HealthController', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {};
    res = {
      status: () => true,
      json: () => true
    };

    sinon.stub(res, 'status').returns(res);
    sinon.stub(res, 'json').returns(res);
  });

  describe('healthCheck()', () => {
    it('should return the correct status and response', done => {
      const healthController = new HealthController();
      healthController.healthCheck(req, res);
      expect(res.status).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledOnce;
      expect(res.json).to.have.been.calledWith({status: 'OK'});
      done();
    });
  });

  describe('readinessCheck()', () => {
    it('should return the correct status and response', done => {
      const healthController = new HealthController();
      healthController.readinessCheck(req, res);
      expect(res.status).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledOnce;
      expect(res.json).to.have.been.calledWith({ready: true});
      done();
    });
  });
});
