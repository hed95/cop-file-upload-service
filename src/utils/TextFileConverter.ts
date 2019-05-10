import {convert} from 'libreoffice-convert';
import IConfig from '../interfaces/IConfig';
import IFileConverter from '../interfaces/IFileConverter';

class TextFileConverter implements IFileConverter {
  public util: any;
  protected config: IConfig;

  constructor(util: any, config: IConfig) {
    this.util = util;
    this.config = config;
  }

  public fetchFileBuffer(file: Express.Multer.File, newFileType: string): any {
    const convertAsync = this.util.promisify(convert);
    return convertAsync(file.buffer, newFileType, undefined);
  }
}

export default TextFileConverter;
