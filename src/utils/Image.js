import config from '../config';

class Image {
  constructor(gm, util) {
    this.gm = gm;
    this.util = util;
  }

  fetchFileBuffer(file, newFileType) {
    const newGm = this.gm(file.buffer, file.originalname);
    const toBufferAsync = this.util.promisify(newGm.toBuffer.bind(newGm));
    return toBufferAsync(newFileType);
  }

  newMimeType(currentMimeType, originalMimeType) {
    let newMimeType;

    if (currentMimeType === 'image/jpeg') {
      newMimeType = ['image/png', 'png'];
    } else {
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

  async convert(file, logger) {
    let counter;

    logger.info(`Converting file ${config.virusFileConversions} times to remove virus`);

    file.originalMimeType = file.mimetype;

    for (counter = 0; counter < config.virusFileConversions; counter++) {
      const convertedFile = await this.fetchFile(file);
      logger.info(`File converted from ${file.mimetype} to ${convertedFile.mimetype}`);
      file = {...file, ...convertedFile};
    }

    return file;
  }
}

export default Image;
