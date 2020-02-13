import {LogEntry} from 'winston';
import ILogMessage from '../interfaces/ILogMessage';

class LogMessage {
  public static create(params: ILogMessage): LogEntry {
    const {email, filename, message, level, timestamp}: ILogMessage = params;

    const logMessage: LogEntry = { email: email || 'user@example.com', filename, level: level || 'info', message };

    if (timestamp) {
      logMessage.timestamp = timestamp;
    }

    return logMessage;
  }
}

export default LogMessage;
