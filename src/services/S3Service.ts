import * as AWS from 'aws-sdk';
import IConfig from '../interfaces/IConfig';
import IDeleteRequestParams from '../interfaces/IDeleteRequestParams';
import IGetRequestParams from '../interfaces/IGetRequestParams';
import IPostRequestParams from '../interfaces/IPostRequestParams';
import IS3DeleteParams from '../interfaces/IS3DeleteParams';
import IS3DownloadParams from '../interfaces/IS3DownloadParams';
import IS3UploadParams from '../interfaces/IS3UploadParams';
import StorageKey from '../utils/StorageKey';

class S3Service {
  public util: any;
  protected s3: any;
  protected config: IConfig;

  constructor(config: IConfig, util: any) {
    this.s3 = this.init(config);
    this.config = config;
    this.util = util;
  }

  public init(config: IConfig): AWS.S3 {
    const {s3}: IConfig['services'] = config.services;
    return new AWS.S3({
      accessKeyId: s3.accessKeyId,
      region: s3.region,
      secretAccessKey: s3.secretAccessKey
    });
  }

  public downloadParams(config: IConfig, params: IGetRequestParams): IS3DownloadParams {
    const {s3}: IConfig['services'] = config.services;
    return {
      Bucket: s3.bucket,
      Key: StorageKey.format(params)
    };
  }

  public uploadParams(config: IConfig, params: IPostRequestParams): IS3UploadParams {
    const {s3}: IConfig['services'] = config.services;
    const {file, processKey}: IPostRequestParams = params;
    return {
      Body: file.buffer,
      Bucket: s3.bucket,
      ContentType: file.mimetype,
      Key: StorageKey.format({processKey, fileVersion: file.version, filename: file.filename}),
      Metadata: {
        originalfilename: file.originalname,
        processedtime: file.processedTime.toString()
      },
      SSEKMSKeyId: s3.sseKmsKeyId,
      ServerSideEncryption: s3.serverSideEncryption
    };
  }

  public deleteParams(config: IConfig, params: IDeleteRequestParams): IS3DeleteParams {
    const {s3}: IConfig['services'] = config.services;
    const {filename, processKey}: IDeleteRequestParams = params;
    return {
      Bucket: s3.bucket,
      Delete: {
        Objects: Object.values(config.fileVersions).map((fileVersion) => ({
          Key: StorageKey.format({processKey, fileVersion, filename})
        })),
        Quiet: true
      }
    };
  }

  public downloadFile(params: IGetRequestParams): Promise<AWS.S3.Object> {
    const downloadParams: IS3DownloadParams = this.downloadParams(this.config, params);
    return this.fetchAsync('getObject', downloadParams);
  }

  public uploadFile(params: IPostRequestParams): Promise<AWS.S3.Object> {
    const uploadParams: IS3UploadParams = this.uploadParams(this.config, params);
    return this.fetchAsync('upload', uploadParams);
  }

  public deleteFiles(params: IDeleteRequestParams): Promise<AWS.S3.Object> {
    const deleteParams: IS3DeleteParams = this.deleteParams(this.config, params);
    return this.fetchAsync('deleteObjects', deleteParams);
  }

  public fetchAsync(method: string, params: object): Promise<AWS.S3.Object> {
    const asyncMethod: any = this.util.promisify(this.s3[method].bind(this.s3));
    return asyncMethod(params);
  }
}

export default S3Service;
