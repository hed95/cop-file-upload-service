import {NextFunction, Request, Response} from 'express';
import IConfig from '../interfaces/IConfig';
import FileService from '../services/FileService';
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
    const fileService: FileService = new FileService();
    logger('Parsing file for ocr');

    if (FileType.isValidFileTypeForOcr(fileType)) {
      try {
        const fileContents: Buffer = fileService.readFile(fileVersions.clean, req.uuid);
        const text: string = await this.ocr(fileContents);
        logger('Parsed text from file');
        fileService.writeFile(fileVersions.ocr, req.uuid, new Buffer(text.trim()));
        req.allFiles[fileVersions.ocr] = {
          ...req.file,
          ...{
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
