import IConfig from '../interfaces/IConfig';

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
    let newMimeType: string[];

    switch (currentMimeType) {
      case 'image/jpeg':
      case 'application/pdf':
        newMimeType = ['image/png', 'png'];
        break;
      default:
        newMimeType = ['image/jpeg', 'jpg'];
    }

    if (newMimeType[0] === originalMimeType) {
      return ['image/tiff', 'tif'];
    }

    return newMimeType;
  }

  public async fetchFile(file: File): Promise<{mimetype: string, buffer: Buffer}> {
    const {mimetype, originalMimeType} = file;
    const [newMimeType, newExtension] = this.newMimeType(mimetype, originalMimeType);
    const newBuffer = await this.fetchFileBuffer(file, newExtension);
    return {mimetype: newMimeType, buffer: newBuffer};
  }

  public async convert(file: File, logger: any, fileConversionCount: number): Promise<File> {
    let counter: number;

    logger(`Converting file ${fileConversionCount} times`);

    file.originalMimeType = file.mimetype;

    for (counter = 0; counter < fileConversionCount; counter++) {
      const convertedFile = await this.fetchFile(file);
      logger(`File converted from ${file.mimetype} to ${convertedFile.mimetype}`);
      file = {...file, ...convertedFile};
    }

    return file;
  }
}

export default FileConverter;
