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
    const {logger}: Request = req;
    const {fileVersions}: IConfig = this.config;
    const file: Express.Multer.File = req.allFiles[fileVersions.clean];
    const fileType: string = FileType.fileType(file.mimetype);
    logger('Parsing file for ocr');

    if (FileType.isValidFileTypeForOcr(fileType)) {
      try {
        const text: string = await this.ocr(file.buffer);
        logger('Parsed text from file');
        req.allFiles[fileVersions.ocr] = {
          ...req.file,
          ...{
            buffer: new Buffer(text.trim()),
            mimetype: 'text/plain',
            version: fileVersions.ocr
          }
        };
      } catch (err) {
        logger('Failed to parse text from file', 'error');
        logger(err.toString(), 'error');
      }
    } else {
      logger(`File not parsed - ${file.mimetype} is not valid for ocr`);
    }

    return next();
  }
}

export default OcrController;
