import AWS from 'aws-sdk';
import StorageKey from '../utils/StorageKey';

class S3Service {
  constructor(config, util) {
    this.s3 = this.init(config);
    this.config = config;
    this.util = util;
  }

  init(config) {
    return new AWS.S3({
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      region: config.region
    });
  }

  downloadParams(config, processKey, fileVersion, filename) {
    return {
      Bucket: config.bucket,
      Key: StorageKey.format(processKey, fileVersion, filename)
    };
  }

  uploadParams(config, processKey, file) {
    return {
      Bucket: config.bucket,
      Key: StorageKey.format(processKey, file.version, file.filename),
      Body: file.buffer,
      ServerSideEncryption: config.serverSideEncryption,
      SSEKMSKeyId: config.sseKmsKeyId,
      ContentType: file.mimetype,
      Metadata: {
        originalfilename: file.originalname
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

  fetchAsync(method, params) {
    const asyncMethod = this.util.promisify(this.s3[method].bind(this.s3));
    return asyncMethod(params);
  }
}

export default S3Service;
