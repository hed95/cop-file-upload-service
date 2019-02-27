import {expect, sinon} from '../../../setupTests';

import AWS from 'aws-sdk';
import S3Service from '../../../../src/services/S3Service';

describe('S3Service', () => {
  describe('init()', () => {
    it('should return an instance of AWS.S3', () => {
      const config = {};
      const s3 = new S3Service(config);
      const result = s3.init(config);
      expect(result).to.be.an.instanceOf(AWS.S3);
    });
  });

  describe('downloadParams()', () => {
    it('should return params without body if body is not given', () => {
      const config = {
        bucket: 'awsbucket',
        rawFilesDirectory: 'raw-files'
      };
      const filename = 'a-file.txt';
      const s3 = new S3Service(config);
      const params = s3.downloadParams(config, filename);
      expect(params).to.deep.equal({
        Bucket: config.bucket,
        Key: `${config.rawFilesDirectory}/${filename}`
      });
    });
  });

  describe('uploadParams()', () => {
    it('should return the correct params', () => {
      const config = {
        bucket: 'awsbucket',
        rawFilesDirectory: 'raw-files',
        serverSideEncryption: 'aws:kms',
        sseKmsKeyId: 'keyid123'
      };
      const file = {
        originalname: 'text-file.txt',
        buffer: 'some file contents',
        mimetype: 'text/plain',
        filename: '9e5eb809-bce7-463e-8c2f-b6bd8c4832d9'
      };
      const s3 = new S3Service(config);
      const params = s3.uploadParams(config, file);
      expect(params).to.deep.equal({
        Bucket: config.bucket,
        Key: `${config.rawFilesDirectory}/${file.filename}`,
        Body: file.buffer,
        ServerSideEncryption: config.serverSideEncryption,
        SSEKMSKeyId: config.sseKmsKeyId,
        ContentType: file.mimetype,
        Metadata: {
          originalfilename: file.originalname
        }
      });
    });
  });

  describe('downloadFile()', () => {
    it('should call fetchAsync() with the correct params', () => {
      const config = {bucket: 'awsbucket'};
      const filename = 'text-file.txt';
      const s3 = new S3Service(config);

      s3.downloadParams = sinon.stub().returns({Bucket: config.bucket});
      s3.fetchAsync = sinon.spy();

      s3.downloadFile(filename);
      expect(s3.downloadParams).to.have.been.calledOnce;
      expect(s3.downloadParams).to.have.been.calledWith(config, filename);
      expect(s3.fetchAsync).to.have.been.calledOnce;
      expect(s3.fetchAsync).to.have.been.calledWith('getObject', {Bucket: config.bucket});
    });
  });

  describe('uploadFile()', () => {
    it('should call fetchAsync() with the correct params', () => {
      const config = {bucket: 'awsbucket'};
      const file = {originalname: 'text-file.txt'};
      const s3 = new S3Service(config);

      s3.uploadParams = sinon.stub().returns({Bucket: config.bucket});
      s3.fetchAsync = sinon.spy();

      s3.uploadFile(file);
      expect(s3.uploadParams).to.have.been.calledOnce;
      expect(s3.uploadParams).to.have.been.calledWith(config, file);
      expect(s3.fetchAsync).to.have.been.calledOnce;
      expect(s3.fetchAsync).to.have.been.calledWith('upload', {Bucket: config.bucket});
    });
  });

  describe('fetchAsync()', () => {
    it('should...', () => {
      const config = {};
      const util = {
        promisify: sinon.stub().returns(() => true)
      };
      const s3 = new S3Service(config, util);

      s3.fetchAsync('upload', {file: {}});
      expect(s3.util.promisify).to.have.been.calledOnce;
    });
  });
});
