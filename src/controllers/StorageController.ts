import {NextFunction, Request, Response} from 'express';
import moment = require('moment');
import IConfig from '../interfaces/IConfig';
import IPostRequestParams from '../interfaces/IPostRequestParams';
import IS3UploadParams from '../interfaces/IS3UploadParams';
import S3Service from '../services/S3Service';
import StorageKey from '../utils/StorageKey';

class StorageController {
  protected storageService: S3Service;
  protected config: IConfig;

  constructor(storageService: S3Service, config: IConfig) {
    this.storageService = storageService;
    this.config = config;
    this.downloadFile = this.downloadFile.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.deleteFiles = this.deleteFiles.bind(this);
    this.listFiles = this.listFiles.bind(this);
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
      businessKey: params.businessKey,
      email: req.kauth && req.kauth.grant && req.kauth.grant.access_token.content.email,
      file: fileToUpload
    };

    try {
      if (fileToUpload) {
        logger(`Uploading file - ${fileToUpload.version} version`);
        await this.storageService.uploadFile(uploadParams);
        logger(`File uploaded - ${fileToUpload.version} version`);
        delete allFiles[fileVersionToUpload];
      }
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

  public async listFiles(req: Request, res: Response): Promise<Response> {
    const {logger, params}: Request = req;
    logger('Downloading file list');

    try {
      logger('File list downloaded');
      const {endpoints, hostname, protocol} = this.config;
      const {Contents}: any = await this.storageService.listFiles(params);
      const promises = Contents.map(({Key}: any) => this.storageService.listMetadata(Key));
      const files = await Promise.all(promises);
      const data = files.map(({ETag, Metadata}: {ETag: string; Metadata: IS3UploadParams['Metadata']}) => ({
        submittedDateTime: moment(Metadata.processedtime, 'x').format('YYYY-MM-DD HH:mm:ss'),
        submittedEmail: Metadata.email,
        submittedFilename: Metadata.originalfilename,
        url: `${protocol}${hostname}${endpoints.files}/${StorageKey.get(Contents, ETag)}`
      }));
      return res.status(200).json(data);
    } catch (err) {
      logger('Failed to download file list', 'error');
      logger(err.toString(), 'error');
      return res.status(500).json({error: 'Failed to download file list'});
    }
  }
}

export default StorageController;
