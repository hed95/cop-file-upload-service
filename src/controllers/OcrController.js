class OcrController {
  constructor(ocr) {
    this.ocr = ocr;
    this.parseFile = this.parseFile.bind(this);
  }

  async parseFile(req, res, next) {
    const {file, logger} = req;
    const fileType = this.getFileType(file.mimetype);
    logger.info('Parsing file for ocr');

    if (this.isSupportedFileType(fileType)) {
      try {
        const text = await this.ocr(file.buffer);
        logger.info('Parsed text from file');
        logger.info(text.trim());
      } catch (err) {
        logger.error('Failed to parse text from file');
        logger.error(err.toString());
      }
    } else {
      logger.error(`Failed to parse file as ${fileType} is an unsupported file type`);
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
