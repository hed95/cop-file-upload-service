import {LogEntry} from 'winston';
import ILogMessage from '../interfaces/ILogMessage';

class LogMessage {
  public static create({email, filename, message, level, timestamp}: ILogMessage): LogEntry {
    const logMessage: LogEntry = {filename, level: level || 'info', message};

    if (email) {
      logMessage.email = email;
    }

    if (timestamp) {
      logMessage.timestamp = timestamp;
    }

    return logMessage;
  }
}

export default LogMessage;
