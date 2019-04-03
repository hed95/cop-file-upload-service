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
    const gm = this.gm(file.buffer, file.originalname);
    return file.mimetype === 'application/pdf' ? gm.density(pdfDensity, pdfDensity) : gm;
  }

  public fetchFileBuffer(file: File, newFileType: string): Buffer {
    const gm = this.initGm(file);
    const toBufferAsync = this.util.promisify(gm.toBuffer.bind(gm));
    return toBufferAsync(newFileType);
  }

  public newMimeType(currentMimeType: string, originalMimeType: string): string[] {
    if (currentMimeType === originalMimeType) {
      const mimeTypeMap: {[key: string]: string[]} = {
        'application/pdf': ['image/png', 'png'],
        'image/jpeg': ['image/png', 'png']
      };
      return mimeTypeMap[currentMimeType] || ['image/jpeg', 'jpeg'];
    }

    return [originalMimeType, FileType.fileType(originalMimeType)];
  }

  public async fetchFile(file: File): Promise<IFileConversionReturnParams> {
    const {mimetype, originalMimeType}: File = file;
    const [newMimeType, newExtension]: string[] = this.newMimeType(mimetype, originalMimeType);
    const newBuffer: Buffer = await this.fetchFileBuffer(file, newExtension);
    return {
      buffer: newBuffer,
      mimetype: newMimeType,
      version: this.config.fileVersions.clean
    };
  }

  public async convert(file: File, logger: any): Promise<File> {
    logger('Converting file');
    const convertedFile: IFileConversionReturnParams = await this.fetchFile(file);
    logger(`File converted from ${file.mimetype} to ${convertedFile.mimetype}`);
    return {...file, ...convertedFile};
  }
}

export default FileConverter;
