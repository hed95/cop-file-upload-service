class StorageController {
  constructor(storageService) {
    this.storageService = storageService;
    this.downloadFile = this.downloadFile.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  async downloadFile(req, res) {
    const {logger, params} = req;
    const {processKey, fileVersion, filename} = params;
    logger.info('Downloading file');

    try {
      const {ContentType, Body} = await this.storageService.downloadFile(processKey, fileVersion, filename);
      logger.info('File downloaded');
      res
        .set('Content-Type', ContentType)
        .set('Content-Disposition', `attachment; filename=${filename}`)
        .status(200)
        .send(Body);
    } catch (err) {
      logger.error('Failed to download file');
      logger.error(err.toString());
      res.status(500).json({error: 'Failed to download file'});
    }
  }

  async uploadFile(req, res, next) {
    const {body, file, logger} = req;
    logger.info('Uploading file');

    try {
      await this.storageService.uploadFile(body.processKey, file);
      logger.info('File uploaded');
      next();
    } catch (err) {
      logger.error('Failed to upload file');
      logger.error(err.toString());
      res.status(500).json({error: 'Failed to upload file'});
    }
  }
}

export default StorageController;
