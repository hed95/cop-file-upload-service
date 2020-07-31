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
    const {file, logger}: Request = req;
    const {fileVersions}: IConfig = this.config;
    let convertedFile: Express.Multer.File;

    req.allFiles = req.allFiles || {};

    const fileToConvert: Express.Multer.File = req.allFiles[fileVersions.clean] || file;

    try {
      if (FileType.isValidFileTypeForConversion(fileToConvert.mimetype)) {
        logger(`File can be converted - ${fileToConvert.mimetype}`);
        convertedFile = await this.fileConverter.convert(fileToConvert, logger);
      } else {
        logger(`File not valid for conversion - ${file.mimetype}`);
        convertedFile = {...file, ...{version: fileVersions.clean}};
      }
      req.allFiles[fileVersions.clean] = convertedFile;
      return next();
    } catch (err) {
      logger('Unable to convert file', 'error');
      logger(err.toString(), 'error');
      return res.status(500).json({error: 'Unable to convert file'});
    }
  }
}

export default FileConversionController;
