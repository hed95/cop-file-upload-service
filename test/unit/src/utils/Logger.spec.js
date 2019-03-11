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
    it('should call format.printf() and formatMessage()', done => {
      const logger = new Logger(createLogger, format, transports);
      const formatMessage = () => true;
      logger.formatMessage = formatMessage;
      logger.outputFormat();
      expect(format.printf).to.have.been.calledOnce;
      expect(format.printf).to.have.been.calledWith(formatMessage);
      done();
    });
  });

  describe('formatMessage()', () => {
    it('should format a log message correctly when given a message as a string', done => {
      const params = {
        level: 'info',
        message: 'Virus scaning file',
        timestamp: '2019-03-11T15:15:49.983Z'
      };
      const logger = new Logger(createLogger, format, transports);
      const message = logger.formatMessage(params);
      expect(message).to.equal(`${params.timestamp} - ${params.level}: ${params.message}`);
      done();
    });

    it('should format a log message correctly when given a message as an object', done => {
      const params = {
        level: 'info',
        message: {
          fieldname: 'file',
          originalname: 'ocr-test-file.pdf'
        },
        timestamp: '2019-03-11T15:15:49.983Z'
      };
      const logger = new Logger(createLogger, format, transports);
      const message = logger.formatMessage(params);
      expect(message).to.equal(`${params.timestamp} - ${params.level}: ${JSON.stringify(params.message)}`);
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
