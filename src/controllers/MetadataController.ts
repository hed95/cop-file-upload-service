import {NextFunction, Request, Response} from 'express';
import IConfig from '../interfaces/IConfig';

class MetadataController {
  protected processedTime: number;
  protected config: IConfig;

  constructor(processedTime: number, config: IConfig) {
    this.processedTime = processedTime;
    this.config = config;
    this.generateMetadata = this.generateMetadata.bind(this);
  }

  public generateMetadata(req: Request, res: Response, next: NextFunction): Response | void {
    req.file = {
      ...req.file,
      ...{
        filename: req.uuid,
        originalMimeType: req.file.mimetype,
        processedTime: this.processedTime,
        version: this.config.fileVersions.original
      }
    };
    req.allFiles = {
      [this.config.fileVersions.original]: req.file
    };

    return next();
  }
}

export default MetadataController;
