import {NextFunction, Request, Response} from 'express';
import {v4String} from 'uuid/interfaces';

class MetadataController {
  protected uuid: v4String;
  protected processedTime: number;

  constructor(uuid: v4String, processedTime: number) {
    this.uuid = uuid;
    this.processedTime = processedTime;
    this.generateMetadata = this.generateMetadata.bind(this);
  }

  public generateMetadata(req: Request, res: Response, next: NextFunction): Response | void {
    req.file.filename = this.uuid();
    req.file.processedTime = this.processedTime;
    return next();
  }
}

export default MetadataController;
