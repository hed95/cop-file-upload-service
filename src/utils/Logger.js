class Logger {
  constructor(createLogger, format, transports) {
    this.createLogger = createLogger;
    this.transports = transports;
    this.combine = format.combine;
    this.printf = format.printf;
    this.timestamp = format.timestamp;
  }

  outputFormat() {
    return this.printf(({level, message, timestamp}) => {
      if (typeof message === 'object') {
        message = JSON.stringify(message);
      }
      return `${timestamp} - ${level}: ${message}`;
    });
  }

  logger() {
    const logger = this.createLogger({
      format: this.combine(
        this.timestamp(),
        this.outputFormat()
      ),
      transports: [
        new this.transports.Console()
      ]
    });
    return logger;
  }
}

export default Logger;
