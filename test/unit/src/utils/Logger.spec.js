import {expect, sinon} from '../../../setupTests';

import Logger from '../../../../src/utils/Logger';

describe('Logger', () => {
  let createLogger;
  let format;
  let transports;

  beforeEach(() => {
    createLogger = sinon.spy();
    format = {
      printf: sinon.spy(),
      timestamp: sinon.stub().returns('a timestamp'),
      combine: sinon.stub()
    };
    transports = {
      Console: sinon.stub()
    };
  });

  describe('outputFormat()', () => {
    it('should call format.printf()', done => {
      const logger = new Logger(createLogger, format, transports);
      logger.outputFormat();
      expect(format.printf).to.have.been.calledOnce;
      done();
    });
  });

  describe('logger()', () => {
    it('should call createLogger', done => {
      const logger = new Logger(createLogger, format, transports);
      logger.logger();
      expect(createLogger).to.have.been.calledOnce;
      done();
    });
  });
});
