import { LogEntry } from 'winston';
import LogMessage from '../../../../src/utils/LogMessage';
import {expect} from '../../../setupTests';

describe('LogMessage', () => {
  let email: string;
  let filename: string;
  let message: string;

  beforeEach(() => {
    email = 'officer@homeoffice.gov.uk';
    filename = '9e5eb809-bce7-463e-8c2f-b6bd8c4832d9';
    message = 'File uploaded - orig version';
  });

  describe('create()', () => {
    it('should return a log messsage in the correct format when given all params', (done) => {
      const level: string = 'error';
      const logMessage: LogEntry = LogMessage.create({email, filename, message, level});
      expect(logMessage).to.deep.equal({
        email,
        filename,
        level: 'error',
        message
      });
      done();
    });

    it('should return a log messsage in the correct format when not given a level', (done) => {
      const logMessage: LogEntry = LogMessage.create({email, filename, message});
      expect(logMessage).to.deep.equal({
        email,
        filename,
        level: 'info',
        message
      });
      done();
    });

    it('should return a log messsage in the correct format when not given an email', (done) => {
      email = undefined;
      const level: string = 'info';
      const logMessage: LogEntry = LogMessage.create({email, filename, message, level});
      expect(logMessage).to.deep.equal({
        filename,
        level: 'info',
        message
      });
      done();
    });
  });
});
