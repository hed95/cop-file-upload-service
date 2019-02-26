import AWS from 'aws-sdk';

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

  downloadParams(config, filename) {
    return {
      Bucket: config.bucket,
      Key: `${config.rawFilesDirectory}/${filename}`,
    };
  }

  uploadParams(config, filename, body) {
    return {
      Bucket: config.bucket,
      Key: `${config.rawFilesDirectory}/${filename}`,
      Body: body,
      ServerSideEncryption: config.serverSideEncryption,
      SSEKMSKeyId: config.sseKmsKeyId
    };
  }

  downloadFile(filename) {
    const params = this.downloadParams(this.config, filename);
    return this.fetchAsync('getObject', params);
  }

  uploadFile(filename, body) {
    const params = this.uploadParams(this.config, filename, body);
    return this.fetchAsync('upload', params);
  }

  fetchAsync(method, params) {
    const asyncMethod = this.util.promisify(this.s3[method].bind(this.s3));
    return asyncMethod(params);
  }
}

export default S3Service;
