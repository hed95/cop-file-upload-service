import {LogEntry} from 'winston';
import Logger from '../../../../src/utils/Logger';
import {expect, sinon} from '../../../setupTests';

describe('Logger', () => {
  let createLogger: any;
  let format: any;
  let transports: any;

  beforeEach(() => {
    createLogger = sinon.spy();
    format = {
      combine: sinon.stub(),
      printf: sinon.spy(),
      timestamp: sinon.stub().returns('a timestamp')
    };
    transports = {
      Console: sinon.stub()
    };
  });

  describe('outputFormat()', () => {
    it('should call format.printf() and formatMessage()', (done) => {
      const logger: Logger = new Logger(createLogger, format, transports);
      const formatMessage = () => '2019-03-26T10:15:33.973Z - info: GET validation passed';
      logger.formatMessage = formatMessage;
      logger.outputFormat();
      expect(format.printf).to.have.been.calledOnce;
      expect(format.printf).to.have.been.calledWith(formatMessage);
      done();
    });
  });

  describe('formatMessage()', () => {
    it('should format a log message correctly when given a message as a string', (done) => {
      const params: LogEntry = {
        level: 'info',
        message: 'Virus scaning file',
        timestamp: '2019-03-11T15:15:49.983Z'
      };
      const logger: Logger = new Logger(createLogger, format, transports);
      const message: string = logger.formatMessage(params);
      expect(message).to.equal(`${params.timestamp} - ${params.level}: ${params.message}`);
      done();
    });
  });

  describe('logger()', () => {
    it('should call createLogger', (done) => {
      const logger = new Logger(createLogger, format, transports);
      logger.logger();
      expect(createLogger).to.have.been.calledOnce;
      done();
    });
  });
});
