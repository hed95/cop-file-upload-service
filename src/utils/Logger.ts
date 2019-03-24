import {LogEntry} from 'winston';
import winston = require('winston');

class Logger {
  private createLogger: any;
  private transports: any;
  private combine: any;
  private printf: any;
  private timestamp: any;

  constructor(createLogger: any, format: any, transports: any) {
    this.createLogger = createLogger;
    this.transports = transports;
    this.combine = format.combine;
    this.printf = format.printf;
    this.timestamp = format.timestamp;
  }

  public outputFormat(): string {
    return this.printf(this.formatMessage);
  }

  public formatMessage({level, message, timestamp}: LogEntry): string {
    return `${timestamp} - ${level}: ${message}`;
  }

  public logger(): winston.Logger {
    return this.createLogger({
      format: this.combine(
        this.timestamp(),
        this.outputFormat()
      ),
      transports: [
        new this.transports.Console()
      ]
    });
  }
}

export default Logger;
