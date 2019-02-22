class StorageController {
  constructor(storageService) {
    this.storageService = storageService;
    this.downloadFile = this.downloadFile.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  async downloadFile(req, res) {
    const {logger, params} = req;
    const {filename} = params;
    logger.info(`Downloading file: ${filename}`);

    try {
      const result = await this.storageService.downloadFile(filename);
      logger.info('File downloaded');
      res.status(200).json(result);
    } catch (err) {
      logger.error('Failed to download file');
      logger.error(err.toString());
      res.status(500).json({error: 'Failed to download file'});
    }
  }

  async uploadFile(req, res) {
    const {file, logger} = req;
    logger.info('Uploading file');

    try {
      const result = await this.storageService.uploadFile(file.originalname, file.buffer);
      logger.info('File uploaded');
      res.status(200).json({location: result.Location});
    } catch (err) {
      logger.error('Failed to upload file');
      logger.error(err.toString());
      res.status(500).json({error: 'Failed to upload file'});
    }
  }
}

export default StorageController;
