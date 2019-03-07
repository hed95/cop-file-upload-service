class FileConverter {
  constructor(gm, util, config) {
    this.gm = gm;
    this.util = util;
    this.config = config;
  }

  initGm(file) {
    const {pdfDensity} = this.config.fileConversions;
    const gm = this.gm(file.buffer, file.originalname);
    return file.mimetype === 'application/pdf' ? gm.density(pdfDensity, pdfDensity) : gm;
  }

  fetchFileBuffer(file, newFileType) {
    const gm = this.initGm(file);
    const toBufferAsync = this.util.promisify(gm.toBuffer.bind(gm));
    return toBufferAsync(newFileType);
  }

  newMimeType(currentMimeType, originalMimeType) {
    let newMimeType;

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

  async fetchFile(file) {
    const {mimetype, originalMimeType} = file;
    const [newMimeType, newExtension] = this.newMimeType(mimetype, originalMimeType);
    const newBuffer = await this.fetchFileBuffer(file, newExtension);
    return {mimetype: newMimeType, buffer: newBuffer};
  }

  async convert(file, logger, fileConversionCount) {
    let counter;

    logger.info(`Converting file ${fileConversionCount} times`);

    file.originalMimeType = file.mimetype;

    for (counter = 0; counter < fileConversionCount; counter++) {
      const convertedFile = await this.fetchFile(file);
      logger.info(`File converted from ${file.mimetype} to ${convertedFile.mimetype}`);
      file = {...file, ...convertedFile};
    }

    return file;
  }
}

export default FileConverter;
