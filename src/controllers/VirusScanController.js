import request from 'superagent';

class VirusScanController {
  constructor(config) {
    this.config = config;
    this.scanFile = this.scanFile.bind(this);
  }

  async scanFile(req, res, next) {
    const {file} = req;
    req.logger.info('Virus scanning file');

    try {
      const res = await request
        .post(`${this.config.url}:${this.config.port}${this.config.path}`)
        .attach('file', file.buffer, file.originalname)
        .field('name', file.originalname);

      if (res.text.includes('true')) {
        req.logger.info('Virus scan passed');
      } else {
        req.logger.error('Virus scan failed');
      }

      next();
    } catch (err) {
      req.logger.error('Unable to call the virus scanning service');
      req.logger.error(err);
      res.status(500).json({error: 'Unable to call the virus scanning service'});
    }
  }
}

export default VirusScanController;
