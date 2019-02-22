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
    let config;
    let filename;

    beforeEach(() => {
      config = {
        bucket: 'awsbucket',
        rawFilesDirectory: 'raw-files'
      };
      filename = 'a-file.txt';
    });

    it('should return params without body if body is not given', () => {
      const s3 = new S3Service(config);
      const params = s3.downloadParams(config, filename);
      expect(params).to.deep.equal({
        Bucket: 'awsbucket',
        Key: 'raw-files/a-file.txt'
      });
    });
  });

  describe('uploadParams()', () => {
    let config;
    let filename;

    beforeEach(() => {
      config = {
        bucket: 'awsbucket',
        rawFilesDirectory: 'raw-files',
      };
      filename = 'a-file.txt';
    });

    it('should return the correct params', () => {
      config = Object.assign(config, {
        serverSideEncryption: 'aws:kms',
        sseKmsKeyId: 'keyid123'
      });
      const body = 'some file contents';
      const s3 = new S3Service(config);
      const params = s3.uploadParams(config, filename, body);
      expect(params).to.deep.equal({
        Bucket: 'awsbucket',
        Key: 'raw-files/a-file.txt',
        Body: 'some file contents',
        ServerSideEncryption: 'aws:kms',
        SSEKMSKeyId: 'keyid123'
      });
    });
  });

  describe('downloadFile()', () => {
    it('should call fetchAsync() with the correct params', () => {
      const config = {};
      const s3 = new S3Service(config);

      s3.downloadParams = sinon.stub().returns({Bucket: 'awsbucket'});
      s3.fetchAsync = sinon.spy();

      s3.downloadFile(config);
      expect(s3.fetchAsync).to.have.been.calledOnce;
      expect(s3.fetchAsync).to.have.been.calledWith('getObject', {Bucket: 'awsbucket'});
    });
  });

  describe('uploadFile()', () => {
    it('should call fetchAsync() with the correct params', () => {
      const config = {};
      const s3 = new S3Service(config);

      s3.uploadParams = sinon.stub().returns({Bucket: 'awsbucket'});
      s3.fetchAsync = sinon.spy();

      s3.uploadFile(config);
      expect(s3.fetchAsync).to.have.been.calledOnce;
      expect(s3.fetchAsync).to.have.been.calledWith('upload', {Bucket: 'awsbucket'});
    });
  });
});
