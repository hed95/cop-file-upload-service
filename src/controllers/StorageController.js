class StorageController {
  constructor(storageService) {
    this.storageService = storageService;
    this.downloadFile = this.downloadFile.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  async downloadFile(req, res) {
    const {logger, params} = req;
    const {filename} = params;
    logger.info('Downloading file');

    try {
      const {ContentType, Body} = await this.storageService.downloadFile(filename);
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

  async uploadFile(req, res) {
    const {file, logger} = req;
    logger.info('Uploading file');

    try {
      await this.storageService.uploadFile(file);
      logger.info('File uploaded');
      res.status(200).json({message: 'File uploaded successfully'});
    } catch (err) {
      logger.error('Failed to upload file');
      logger.error(err.toString());
      res.status(500).json({error: 'Failed to upload file'});
    }
  }
}

export default StorageController;
