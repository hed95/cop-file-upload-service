import {NextFunction, Request, Response} from 'express';
import * as request from 'superagent';
import IConfig from '../interfaces/IConfig';
import FileConverter from '../utils/FileConverter';
import FileType from '../utils/FileType';

class VirusScanController {
  protected fileConverter: FileConverter;
  protected config: IConfig;

  constructor(fileConverter: FileConverter, config: IConfig) {
    this.fileConverter = fileConverter;
    this.config = config;
    this.scanFile = this.scanFile.bind(this);
  }

  public async scanFile(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const {file, logger} = req;
    const {services, fileVersions, fileConversions} = this.config;
    const {virusScan} = services;
    logger('Virus scanning file');

    try {
      const result = await request
        .post(`http://${virusScan.host}:${virusScan.port}${virusScan.path}`)
        .attach('file', file.buffer, file.originalname)
        .field('name', file.originalname);

      if (result.text.includes('true')) {
        logger('Virus scan passed');
        if (FileType.isValidFileTypeForConversion(file.mimetype)) {
          logger(`File can be converted - ${file.mimetype}`);
          req.file = await this.fileConverter.convert(req.file, req.logger, fileConversions.count);
        } else {
          logger(`File cannot be converted - ${file.mimetype}`);
        }
      } else {
        logger('Virus scan failed', 'error');
        return res.status(400).json({error: 'Virus scan failed'});
      }

      req.file.version = fileVersions.clean;
      return next();
    } catch (err) {
      logger('Unable to call the virus scanning service', 'error');
      logger(err.toString(), 'error');
      return res.status(500).json({error: 'Unable to call the virus scanning service'});
    }
  }
}

export default VirusScanController;
