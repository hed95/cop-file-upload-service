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
    logger('Downloading file');

    try {
      const {Body, ContentType, Metadata}: any = await this.storageService.downloadFile(params);
      logger('File downloaded');
      return res
        .set('Content-Type', ContentType)
        .set('Content-Disposition', `attachment; filename=${Metadata.originalfilename}`)
        .status(200)
        .send(Body);
    } catch (err) {
      logger('Failed to download file', 'error');
      logger(err.toString(), 'error');
      return res.status(500).json({error: 'Failed to download file'});
    }
  }

  public async uploadFile(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const {allFiles, logger, params}: Request = req;
    const fileVersionToUpload: string = Object.keys(allFiles)[0];
    const fileToUpload: Express.Multer.File = allFiles[fileVersionToUpload];
    const uploadParams: IPostRequestParams = {
      file: fileToUpload,
      processKey: params.processKey
    };

    logger(`Uploading file - ${fileToUpload.version} version`);

    try {
      await this.storageService.uploadFile(uploadParams);
      logger(`File uploaded - ${fileToUpload.version} version`);
      delete allFiles[fileVersionToUpload];
      return next();
    } catch (err) {
      logger(`Failed to upload file - ${fileToUpload.version} version`, 'error');
      logger(err.toString(), 'error');
      return res.status(500).json({error: `Failed to upload file - ${fileToUpload.version} version`});
    }
  }

  public async deleteFiles(req: Request, res: Response): Promise<Response> {
    const {logger, params}: Request = req;
    logger('Deleting files');

    try {
      await this.storageService.deleteFiles(params);
      logger('Files deleted');
      return res.status(200).json({message: 'Files deleted successfully'});
    } catch (err) {
      logger('Failed to delete files', 'error');
      logger(err.toString(), 'error');
      return res.status(500).json({error: 'Failed to delete files'});
    }
  }
}

export default StorageController;
