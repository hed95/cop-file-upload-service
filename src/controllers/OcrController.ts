import {NextFunction, Request, Response} from 'express';
import IConfig from '../interfaces/IConfig';
import FileType from '../utils/FileType';

class OcrController {
  protected ocr: any;
  protected config: IConfig;

  constructor(ocr: any, config: IConfig) {
    this.ocr = ocr;
    this.config = config;
    this.parseFile = this.parseFile.bind(this);
  }

  public async parseFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    const {file, logger} = req;
    const fileType = FileType.fileType(file.mimetype);
    delete req.file.version;
    logger('Parsing file for ocr');

    if (FileType.isValidFileTypeForOcr(fileType)) {
      try {
        const text = await this.ocr(file.buffer);
        logger('Parsed text from file');
        const textFileData = {
          buffer: new Buffer(text.trim()),
          mimetype: 'text/plain',
          version: this.config.fileVersions.ocr
        };
        req.file = {...req.file, ...textFileData};
      } catch (err) {
        logger('Failed to parse text from file', 'error');
        logger(err.toString(), 'error');
      }
    } else {
      logger(`File not parsed - ${fileType} is an unsupported file type`);
    }

    return next();
  }
}

export default OcrController;
