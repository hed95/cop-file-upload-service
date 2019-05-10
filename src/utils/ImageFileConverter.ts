import * as gm from 'gm';
import IConfig from '../interfaces/IConfig';
import IFileConverter from '../interfaces/IFileConverter';

class ImageFileConverter implements IFileConverter {
  public util: any;
  protected config: IConfig;

  constructor(util: any, config: IConfig) {
    this.util = util;
    this.config = config;
    this.fetchFileBuffer = this.fetchFileBuffer.bind(this);
  }

  public initFileConverter(file: Express.Multer.File): gm.State {
    const gmInit: gm.State = gm(file.buffer);

    if (file.mimetype === 'application/pdf') {
      const {pdfDensity}: IConfig['fileConversions'] = this.config.fileConversions;
      gmInit.density(pdfDensity, pdfDensity);
    }

    return gmInit;
  }

  public fetchFileBuffer(file: Express.Multer.File, newFileType: string): Buffer {
    const fileConverter: gm.State = this.initFileConverter(file);
    const asyncMethod = this.util.promisify(fileConverter.toBuffer.bind(fileConverter));
    return asyncMethod(newFileType);
  }
}

export default ImageFileConverter;
