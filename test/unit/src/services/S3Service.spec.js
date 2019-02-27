import {config, expect, sinon} from '../../../setupTests';

import AWS from 'aws-sdk';
import S3Service from '../../../../src/services/S3Service';
import StorageKey from '../../../../src/utils/StorageKey';

describe('S3Service', () => {
  let s3Config;

  beforeEach(() => {
    config.services.s3.bucket = 'awsbucket';
    s3Config = config.services.s3;
  });

  describe('init()', () => {
    it('should return an instance of AWS.S3', () => {
      s3Config = {};
      const s3 = new S3Service(s3Config);
      const result = s3.init(s3Config);
      expect(result).to.be.an.instanceOf(AWS.S3);
    });
  });

  describe('downloadParams()', () => {
    it('should return the correct params', () => {
      const filename = '9e5eb809-bce7-463e-8c2f-b6bd8c4832d9';
      const processKey = 'test-process-key';
      const fileVersion = 'clean';
      const s3 = new S3Service(s3Config);
      const params = s3.downloadParams(s3Config, processKey, fileVersion, filename);
      expect(params).to.deep.equal({
        Bucket: s3Config.bucket,
        Key: StorageKey.format(processKey, fileVersion, filename)
      });
    });
  });

  describe('uploadParams()', () => {
    it('should return the correct params', () => {
      Object.assign(s3Config, {
        serverSideEncryption: 'aws:kms',
        sseKmsKeyId: 'keyid123'
      });
      const file = {
        originalname: 'text-file.txt',
        buffer: 'some file contents',
        mimetype: 'text/plain',
        filename: '9e5eb809-bce7-463e-8c2f-b6bd8c4832d9'
      };
      const processKey = 'test-process-key';
      const fileVersion = 'clean';
      const s3 = new S3Service(s3Config);
      const params = s3.uploadParams(s3Config, processKey, fileVersion, file);
      expect(params).to.deep.equal({
        Bucket: s3Config.bucket,
        Key: StorageKey.format(processKey, fileVersion, file.filename),
        Body: file.buffer,
        ServerSideEncryption: s3Config.serverSideEncryption,
        SSEKMSKeyId: s3Config.sseKmsKeyId,
        ContentType: file.mimetype,
        Metadata: {
          originalfilename: file.originalname
        }
      });
    });
  });

  describe('downloadFile()', () => {
    it('should call fetchAsync() with the correct params', () => {
      const filename = 'text-file.txt';
      const s3 = new S3Service(s3Config);

      s3.downloadParams = sinon.stub().returns({Bucket: s3Config.bucket});
      s3.fetchAsync = sinon.spy();

      s3.downloadFile(filename);
      expect(s3.downloadParams).to.have.been.calledOnce;
      expect(s3.downloadParams).to.have.been.calledWith(s3Config, filename);
      expect(s3.fetchAsync).to.have.been.calledOnce;
      expect(s3.fetchAsync).to.have.been.calledWith('getObject', {Bucket: s3Config.bucket});
    });
  });

  describe('uploadFile()', () => {
    it('should call fetchAsync() with the correct params', () => {
      const file = {originalname: 'text-file.txt'};
      const s3 = new S3Service(s3Config);

      s3.uploadParams = sinon.stub().returns({Bucket: s3Config.bucket});
      s3.fetchAsync = sinon.spy();

      s3.uploadFile(file);
      expect(s3.uploadParams).to.have.been.calledOnce;
      expect(s3.uploadParams).to.have.been.calledWith(s3Config, file);
      expect(s3.fetchAsync).to.have.been.calledOnce;
      expect(s3.fetchAsync).to.have.been.calledWith('upload', {Bucket: s3Config.bucket});
    });
  });

  describe('fetchAsync()', () => {
    it('should...', () => {
      s3Config = {};
      const util = {
        promisify: sinon.stub().returns(() => true)
      };
      const s3 = new S3Service(s3Config, util);

      s3.fetchAsync('upload', {file: {}});
      expect(s3.util.promisify).to.have.been.calledOnce;
    });
  });
});
