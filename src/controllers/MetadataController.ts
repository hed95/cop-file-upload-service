import {NextFunction, Request, Response} from 'express';

class MetadataController {
  protected processedTime: number;

  constructor(processedTime: number) {
    this.processedTime = processedTime;
    this.generateMetadata = this.generateMetadata.bind(this);
  }

  public generateMetadata(req: Request, res: Response, next: NextFunction): Response | void {
    req.file.filename = req.uuid;
    req.file.processedTime = this.processedTime;
    return next();
  }
}

export default MetadataController;
