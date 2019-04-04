import ILogMessage from '../../../../src/interfaces/ILogMessage';
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
      prettyPrint: sinon.spy(),
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
      const params: ILogMessage = {
        email: 'user@example.com',
        filename: '9e5eb809-bce7-463e-8c2f-b6bd8c4832d9',
        level: 'info',
        message: 'Virus scaning file',
        timestamp: '2019-03-11T15:15:49.983Z'
      };
      const logger: Logger = new Logger(createLogger, format, transports);
      const message: string = logger.formatMessage(params);
      expect(message).to.equal(
        `{"email":"${params.email}","filename":"${params.filename}","level":"${params.level}","message":"${params.message}","timestamp":"${params.timestamp}"}`
      );
      done();
    });
  });

  describe('logger()', () => {
    it('should call createLogger', (done) => {
      const logger = new Logger(createLogger, format, transports);
      logger.outputFormat = sinon.spy();
      logger.logger();
      expect(createLogger).to.have.been.calledOnce;
      expect(format.combine).to.have.been.calledOnce;
      expect(format.timestamp).to.have.been.calledOnce;
      expect(logger.outputFormat).to.have.been.calledOnce;
      expect(format.prettyPrint).to.have.been.calledOnce;
      done();
    });
  });
});
