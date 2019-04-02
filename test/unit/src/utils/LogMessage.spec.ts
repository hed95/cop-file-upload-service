import { LogEntry } from 'winston';
import LogMessage from '../../../../src/utils/LogMessage';
import {expect} from '../../../setupTests';

describe('LogMessage', () => {
  let filename: string;
  let message: string;

  beforeEach(() => {
    filename = '9e5eb809-bce7-463e-8c2f-b6bd8c4832d9';
    message = 'File uploaded - orig version';
  });

  describe('create()', () => {
    it('should return a log messsage in the correct format when not given a level', (done) => {
      const logMessage: LogEntry = LogMessage.create({filename, message});
      expect(logMessage).to.deep.equal({
        filename,
        level: 'info',
        message
      });
      done();
    });

    it('should return a log messsage in the correct format when given a level', (done) => {
      const level: string = 'error';
      const logMessage: LogEntry = LogMessage.create({filename, message, level});
      expect(logMessage).to.deep.equal({
        filename,
        level: 'error',
        message
      });
      done();
    });
  });
});
