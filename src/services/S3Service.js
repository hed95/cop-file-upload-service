import AWS from 'aws-sdk';
import StorageKey from '../utils/StorageKey';

class S3Service {
  constructor(config, util) {
    this.s3 = this.init(config);
    this.config = config;
    this.util = util;
  }

  init(config) {
    const {s3} = config.services;
    return new AWS.S3({
      accessKeyId: s3.accessKeyId,
      secretAccessKey: s3.secretAccessKey,
      region: s3.region
    });
  }

  downloadParams(config, processKey, fileVersion, filename) {
    const {s3} = config.services;
    return {
      Bucket: s3.bucket,
      Key: StorageKey.format(processKey, fileVersion, filename)
    };
  }

  uploadParams(config, processKey, file) {
    const {s3} = config.services;
    return {
      Bucket: s3.bucket,
      Key: StorageKey.format(processKey, file.version, file.filename),
      Body: file.buffer,
      ServerSideEncryption: s3.serverSideEncryption,
      SSEKMSKeyId: s3.sseKmsKeyId,
      ContentType: file.mimetype,
      Metadata: {
        originalfilename: file.originalname,
        processedtime: file.processedTime.toString()
      }
    };
  }

  deleteParams(config, processKey, filename) {
    const {s3} = config.services;
    return {
      Bucket: s3.bucket,
      Delete: {
        Objects: Object.values(config.fileVersions).map(version => ({
          Key: StorageKey.format(processKey, version, filename)
        })),
        Quiet: true
      }
    };
  }

  downloadFile(processKey, fileVersion, filename) {
    const params = this.downloadParams(this.config, processKey, fileVersion, filename);
    return this.fetchAsync('getObject', params);
  }

  uploadFile(processKey, file) {
    const params = this.uploadParams(this.config, processKey, file);
    return this.fetchAsync('upload', params);
  }

  deleteFiles(processKey, filename) {
    const params = this.deleteParams(this.config, processKey, filename);
    return this.fetchAsync('deleteObjects', params);
  }

  fetchAsync(method, params) {
    const asyncMethod = this.util.promisify(this.s3[method].bind(this.s3));
    return asyncMethod(params);
  }
}

export default S3Service;
