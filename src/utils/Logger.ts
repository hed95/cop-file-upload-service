import winston = require('winston');
import ILogMessage from '../interfaces/ILogMessage';
import LogMessage from './LogMessage';

class Logger {
  private createLogger: any;
  private transports: any;
  private combine: any;
  private printf: any;
  private prettyPrint: any;
  private timestamp: any;

  constructor(createLogger: any, format: any, transports: any) {
    this.createLogger = createLogger;
    this.transports = transports;
    this.combine = format.combine;
    this.printf = format.printf;
    this.prettyPrint = format.prettyPrint;
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
        this.prettyPrint()
      ),
      transports: [
        new this.transports.Console()
      ]
    });
  }
}

export default Logger;
