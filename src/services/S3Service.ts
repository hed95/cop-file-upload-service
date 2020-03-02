import * as AWS from 'aws-sdk';
import IConfig from '../interfaces/IConfig';
import IDeleteRequestParams from '../interfaces/IDeleteRequestParams';
import IGetRequestParams from '../interfaces/IGetRequestParams';
import IPostRequestParams from '../interfaces/IPostRequestParams';
import IRequestParams from '../interfaces/IRequestParams';
import IS3DeleteParams from '../interfaces/IS3DeleteParams';
import IS3DownloadParams from '../interfaces/IS3DownloadParams';
import IS3ListMetadataParams from '../interfaces/IS3ListMetadataParams';
import IS3ListParams from '../interfaces/IS3ListParams';
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
    const {businessKey, email = '', file}: IPostRequestParams = params;
    return {
      Body: file.buffer,
      Bucket: s3.bucket,
      ContentType: file.mimetype,
      Key: StorageKey.format({businessKey, fileVersion: file.version, filename: file.filename}),
      Metadata: {
        email,
        originalfilename: file.originalname,
        processedtime: file.processedTime.toString()
      }
    };
  }

  public deleteParams(config: IConfig, params: IDeleteRequestParams): IS3DeleteParams {
    const {s3}: IConfig['services'] = config.services;
    const {businessKey, filename}: IDeleteRequestParams = params;
    return {
      Bucket: s3.bucket,
      Delete: {
        Objects: Object.values(config.fileVersions).map((fileVersion) => ({
          Key: StorageKey.format({businessKey, fileVersion, filename})
        })),
        Quiet: true
      }
    };
  }

  public listParams(config: IConfig, params: IRequestParams): IS3ListParams {
    const {fileVersions}: IConfig = config;
    const {businessKey}: IRequestParams = params;
    return {
      Bucket: this.config.services.s3.bucket,
      Prefix: `${businessKey}/${fileVersions.clean}`
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

  public listFiles(params: IRequestParams): Promise<AWS.S3.Object> {
    const listParams: IS3ListParams = this.listParams(this.config, params);
    return this.fetchAsync('listObjectsV2', listParams);
  }

  public listMetadata(key: string): Promise<AWS.S3.Object> {
    const listParams: IS3ListMetadataParams = {
      Bucket: this.config.services.s3.bucket,
      Key: key
    };

    return this.fetchAsync('headObject', listParams);
  }

  public fetchAsync(method: string, params: object): Promise<AWS.S3.Object> {
    const asyncMethod: any = this.util.promisify(this.s3[method].bind(this.s3));
    return asyncMethod(params);
  }
}

export default S3Service;
