class Logger {
  constructor(createLogger, format, transports) {
    this.createLogger = createLogger;
    this.transports = transports;
    this.combine = format.combine;
    this.printf = format.printf;
    this.timestamp = format.timestamp;
  }

  outputFormat() {
    return this.printf(this.formatMessage);
  }

  formatMessage({level, message, timestamp}) {
    message = typeof message === 'object' ? JSON.stringify(message) : message;
    return `${timestamp} - ${level}: ${message}`;
  }

  logger() {
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
