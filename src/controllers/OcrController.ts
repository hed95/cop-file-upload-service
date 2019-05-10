import {NextFunction, Request, Response} from 'express';
import * as pdfParse from 'pdf-parse';
import * as tesseract from 'tesseractocr';
import IConfig from '../interfaces/IConfig';
import IOcr from '../interfaces/IOcr';
import FileType from '../utils/FileType';

class OcrController {
  protected config: IConfig;
  protected imageOcr: any;
  protected pdfOcr: any;
  protected fileService: any;

  constructor(config: IConfig, imageOcr: any, pdfOcr: any, fileService: any) {
    this.config = config;
    this.imageOcr = imageOcr;
    this.pdfOcr = pdfOcr;
    this.fileService = fileService;
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
        const fileContents: Buffer = this.fileService.readFile(fileVersions.clean, req.uuid);
        const ocr: IOcr = (fileType === 'pdf') ? new this.pdfOcr(pdfParse) : new this.imageOcr(tesseract);
        const text: string = await ocr.getText(fileContents);

        logger('Parsed text from file');

        this.fileService.writeFile(fileVersions.ocr, req.uuid, new Buffer(text));

        req.allFiles[fileVersions.ocr] = {
          ...file,
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
