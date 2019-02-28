class OcrController {
  constructor(ocr, config) {
    this.ocr = ocr;
    this.config = config;
    this.parseFile = this.parseFile.bind(this);
  }

  async parseFile(req, res, next) {
    const {file, logger} = req;
    const fileType = this.getFileType(file.mimetype);
    delete req.file.version;
    logger.info('Parsing file for ocr');

    if (this.isSupportedFileType(fileType)) {
      try {
        const text = await this.ocr(file.buffer);
        logger.info('Parsed text from file');
        const textFileData = {
          buffer: new Buffer(text.trim()),
          version: this.config.fileVersions.ocr,
          mimetype: 'text/plain'
        };
        req.file = {...req.file, ...textFileData};
      } catch (err) {
        logger.error('Failed to parse text from file');
        logger.error(err.toString());
      }
    } else {
      logger.info(`File not parsed - ${fileType} is an unsupported file type`);
    }

    next();
  }

  isSupportedFileType(fileType) {
    return ['bmp', 'pnm', 'png', 'jfif', 'jpeg', 'tiff'].includes(fileType);
  }

  getFileType(mimeType) {
    return mimeType.split('/')[1];
  }
}

export default OcrController;
