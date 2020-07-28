import IConfig from '../interfaces/IConfig';
import IFileConversionReturnParams from '../interfaces/IFileConversionReturnParams';
import FileType from './FileType';

type File = Express.Multer.File;

class FileConverter {
  public gm: any;
  public util: any;
  protected config: IConfig;

  constructor(gm: any, util: any, config: IConfig) {
    this.gm = gm;
    this.util = util;
    this.config = config;
  }

  public initGm(file: File) {
    const {pdfDensity} = this.config.fileConversions;
    const gm = this.gm(file.buffer, file.originalname).command('convert');
    return file.mimetype === 'application/pdf' ? gm.density(pdfDensity, pdfDensity) : gm;
  }

  public fetchFileBuffer(file: File, newFileType: string, logger: any): Buffer {
    logger(`newFileType = ${newFileType}`, 'debug');
    const gm = this.initGm(file);
    logger('set gm', 'debug');
    const toBufferAsync = this.util.promisify(gm.toBuffer.bind(gm));
    logger('set toBufferAsync', 'debug');
    return toBufferAsync(newFileType);
  }

  public newMimeType(currentMimeType: string, originalMimeType: string): string[] {
    if (currentMimeType === originalMimeType) {
      const mimeTypeMap: {[key: string]: string[]} = {
        'application/pdf': ['image/tiff', 'tif'],
        'image/jpeg': ['image/png', 'png']
      };
      return mimeTypeMap[currentMimeType] || ['image/jpeg', 'jpeg'];
    }

    return [originalMimeType, FileType.fileType(originalMimeType)];
  }

  public async fetchFile(file: File, logger: any): Promise<IFileConversionReturnParams> {
    const {mimetype, originalMimeType}: File = file;
    logger(`mimetype = ${mimetype}`, 'debug');
    logger(`originalMimeType = ${originalMimeType}`, 'debug');
    const [newMimeType, newExtension]: string[] = this.newMimeType(mimetype, originalMimeType);
    logger(`newMimeType = ${newMimeType}`, 'debug');
    logger(`newExtension = ${newExtension}`, 'debug');
    const newBuffer: Buffer = await this.fetchFileBuffer(file, newExtension, logger);
    logger('set newBuffer', 'debug');
    return {
      buffer: newBuffer,
      mimetype: newMimeType,
      version: this.config.fileVersions.clean
    };
  }

  public async convert(file: File, logger: any): Promise<File> {
    logger('Converting file');
    const convertedFile: IFileConversionReturnParams = await this.fetchFile(file, logger);
    logger(`File converted from ${file.mimetype} to ${convertedFile.mimetype}`);
    return {...file, ...convertedFile};
  }
}

export default FileConverter;
