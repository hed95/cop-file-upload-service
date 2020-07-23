import winston = require('winston');
import config from '../config';
import ILogMessage from '../interfaces/ILogMessage';
import LogMessage from './LogMessage';

class Logger {
  private createLogger: any;
  private transports: any;
  private combine: any;
  private printf: any;
  private json: any;
  private timestamp: any;

  constructor(createLogger: any, format: any, transports: any) {
    this.createLogger = createLogger;
    this.transports = transports;
    this.combine = format.combine;
    this.printf = format.printf;
    this.json = format.json;
    this.timestamp = format.timestamp;
  }

  public outputFormat(): string {
    return this.printf(this.formatMessage);
  }

  public formatMessage({level, message, timestamp, filename, email}: ILogMessage): string {
    return JSON.stringify(LogMessage.create({email, filename, level, message, timestamp}));
  }

  public logger(): winston.Logger {
    return this.createLogger({
      format: this.combine(
        this.timestamp(),
        this.outputFormat(),
        this.json()
      ),
      level: config.logLevel,
      transports: [
        new this.transports.Console()
      ]
    });
  }
}

export default Logger;
