import {NextFunction, Request, Response} from 'express';
import IConfig from '../interfaces/IConfig';
import IPostRequestParams from '../interfaces/IPostRequestParams';
import S3Service from '../services/S3Service';

class StorageController {
  protected storageService: S3Service;
  protected config: IConfig;

  constructor(storageService: S3Service, config: IConfig) {
    this.storageService = storageService;
    this.config = config;
    this.downloadFile = this.downloadFile.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.deleteFiles = this.deleteFiles.bind(this);
  }

  public async downloadFile(req: Request, res: Response): Promise<Response> {
    const {logger, params}: Request = req;
    logger.info('Downloading file');

    try {
      const {Body, ContentType, Metadata}: any = await this.storageService.downloadFile(params);
      logger.info('File downloaded');
      return res
        .set('Content-Type', ContentType)
        .set('Content-Disposition', `attachment; filename=${Metadata.originalfilename}`)
        .status(200)
        .send(Body);
    } catch (err) {
      logger.error('Failed to download file');
      logger.error(err.toString());
      return res.status(500).json({error: 'Failed to download file'});
    }
  }

  public async uploadFile(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const {file, logger, params}: Request = req;
    file.version = file.version || this.config.fileVersions.original;

    const uploadParams: IPostRequestParams = {
      file,
      processKey: params.processKey
    };

    logger.info(`Uploading file - ${file.version} version`);

    try {
      await this.storageService.uploadFile(uploadParams);
      logger.info(`File uploaded - ${file.version} version`);
      return next();
    } catch (err) {
      logger.error(`Failed to upload file - ${file.version} version`);
      logger.error(err.toString());
      return res.status(500).json({error: `Failed to upload file - ${file.version} version`});
    }
  }

  public async deleteFiles(req: Request, res: Response): Promise<Response> {
    const {logger, params}: Request = req;
    logger.info('Deleting files');

    try {
      await this.storageService.deleteFiles(params);
      logger.info('Files deleted');
      return res.status(200).json({message: 'Files deleted successfully'});
    } catch (err) {
      logger.error('Failed to delete files');
      logger.error(err.toString());
      return res.status(500).json({error: 'Failed to delete files'});
    }
  }
}

export default StorageController;
