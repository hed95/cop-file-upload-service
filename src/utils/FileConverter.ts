import IConfig from '../interfaces/IConfig';
import IFileConversionReturnParams from '../interfaces/IFileConversionReturnParams';
import FileType from './FileType';

type File = Express.Multer.File;

class FileConverter {
  public util: any;
  protected config: IConfig;
  protected imageFileConverter: any;
  protected textFileConverter: any;

  constructor(util: any, config: IConfig, imageFileConverter: any, textFileConverter: any) {
    this.util = util;
    this.config = config;
    this.imageFileConverter = imageFileConverter;
    this.textFileConverter = textFileConverter;
  }

  public newMimeType(currentMimeType: string, originalMimeType: string): any[] {
    if (
      (currentMimeType === originalMimeType) ||
      (originalMimeType.includes('word') && currentMimeType !== originalMimeType)
    ) {
      const mimeTypeMap: {[key: string]: any[]} = {
        'application/msword': ['application/pdf', 'pdf', this.textFileConverter],
        'application/pdf': ['image/tiff', 'tiff', this.imageFileConverter],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
          'application/pdf', 'pdf', this.textFileConverter
        ],
        'image/jpeg': ['image/png', 'png', this.imageFileConverter]
      };
      return mimeTypeMap[currentMimeType] || ['image/jpeg', 'jpeg', this.imageFileConverter];
    }

    return [originalMimeType, FileType.fileType(originalMimeType), this.imageFileConverter];
  }

  public async fetchFile(file: File): Promise<IFileConversionReturnParams> {
    const {mimetype, originalMimeType}: File = file;
    const [newMimeType, newExtension, Converter]: any[] = this.newMimeType(mimetype, originalMimeType);

    const newBuffer: Buffer = await new Converter(this.util, this.config).fetchFileBuffer(file, newExtension);
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
