import {NextFunction, Request, Response} from 'express';
import IConfig from '../interfaces/IConfig';
import FileConverter from '../utils/FileConverter';
import FileType from '../utils/FileType';

class FileConversionController {
  protected fileConverter: FileConverter;
  protected config: IConfig;

  constructor(fileConverter: FileConverter, config: IConfig) {
    this.fileConverter = fileConverter;
    this.config = config;
    this.convertFile = this.convertFile.bind(this);
  }

  public async convertFile(req: Request, res: Response, next: NextFunction) {
    const {file, logger} = req;
    const {fileConversions, fileVersions} = this.config;

    try {
      if (FileType.isValidFileTypeForConversion(file.mimetype)) {
        logger(`File can be converted - ${file.mimetype}`);
        req.file = await this.fileConverter.convert(req.file, req.logger, fileConversions.count);
      } else {
        logger(`File cannot be converted - ${file.mimetype}`);
      }
      req.file.version = fileVersions.clean;
      return next();
    } catch (err) {
      logger('Unable to convert file', 'error');
      logger(err.toString(), 'error');
      return res.status(500).json({error: 'Unable to convert file'});
    }
  }
}

export default FileConversionController;
