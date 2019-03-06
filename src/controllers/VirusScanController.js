import request from 'superagent';

class VirusScanController {
  constructor(fileConverter, config) {
    this.fileConverter = fileConverter;
    this.config = config;
    this.scanFile = this.scanFile.bind(this);
  }

  async scanFile(req, res, next) {
    const {file, logger} = req;
    const {services, fileVersions, fileConversions} = this.config;
    const {virusScan} = services;
    logger.info('Virus scanning file');

    try {
      const res = await request
        .post(`${virusScan.url}:${virusScan.port}${virusScan.path}`)
        .attach('file', file.buffer, file.originalname)
        .field('name', file.originalname);

      if (res.text.includes('true')) {
        logger.info('Virus scan passed');

        if (file.mimetype === 'application/pdf') {
          logger.info('Converting pdf to an image for ocr');
          req.file = await this.fileConverter.convert(req.file, logger, 1);
        }
      } else {
        logger.error('Virus scan failed');
        req.file = await this.fileConverter.convert(req.file, logger, fileConversions.count);
      }

      req.file.version = fileVersions.clean;
      next();
    } catch (err) {
      logger.error('Unable to call the virus scanning service');
      logger.error(err.toString());
      res.status(500).json({error: 'Unable to call the virus scanning service'});
    }
  }
}

export default VirusScanController;
