import {NextFunction, Request, Response} from 'express';
import * as request from 'superagent';
import IConfig from '../interfaces/IConfig';

class VirusScanController {
  protected config: IConfig;
  protected fileService: any;

  constructor(config: IConfig, fileService: any) {
    this.config = config;
    this.fileService = fileService;
    this.scanFile = this.scanFile.bind(this);
  }

  public async scanFile(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const {file, logger} = req;
    const {services} = this.config;
    const {virusScan} = services;
    logger('Virus scanning file');

    try {
      const fileContents: Buffer = this.fileService.readFile(this.config.fileVersions.original, req.uuid);
      const result = await request
        .post(`http://${virusScan.host}:${virusScan.port}${virusScan.path}`)
        .attach('file', fileContents, file.originalname)
        .field('name', file.originalname);

      if (result.text.includes('true')) {
        logger('Virus scan passed');
        return next();
      }

      logger('Virus scan failed', 'error');
      return res.status(400).json({error: 'Virus scan failed'});
    } catch (err) {
      logger('Unable to call the virus scanning service', 'error');
      logger(err.toString(), 'error');
      return res.status(500).json({error: 'Unable to call the virus scanning service'});
    }
  }
}

export default VirusScanController;
