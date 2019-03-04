import request from 'superagent';

class VirusScanController {
  constructor(image, config) {
    this.image = image;
    this.config = config;
    this.scanFile = this.scanFile.bind(this);
  }

  async scanFile(req, res, next) {
    const {file} = req;
    const {services, fileVersions} = this.config;
    const {virusScan} = services;
    req.logger.info('Virus scanning file');

    try {
      const res = await request
        .post(`${virusScan.url}:${virusScan.port}${virusScan.path}`)
        .attach('file', file.buffer, file.originalname)
        .field('name', file.originalname);

      if (res.text.includes('true')) {
        req.logger.info('Virus scan passed');
      } else {
        req.logger.error('Virus scan failed');

        if (file.mimetype.includes('image')) {
          req.file = await this.image.convert(req.file, req.logger);
        }
      }

      req.file.version = fileVersions.clean;
      next();
    } catch (err) {
      req.logger.error('Unable to call the virus scanning service');
      req.logger.error(err.toString());
      res.status(500).json({error: 'Unable to call the virus scanning service'});
    }
  }
}

export default VirusScanController;
