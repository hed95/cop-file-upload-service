class Logger {
  constructor(createLogger, format, transports) {
    this.createLogger = createLogger;
    this.transports = transports;
    this.combine = format.combine;
    this.printf = format.printf;
    this.timestamp = format.timestamp;
  }

  outputFormat() {
    const output = this.printf(({level, message, timestamp}) => {
      if (typeof message === 'object') {
        message = JSON.stringify(message);
      }
      return `${timestamp} - ${level}: ${message}`;
    });
    return output;
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
