import {config, expect, sinon, testFile} from '../../../setupTests';

import AWS from 'aws-sdk';
import S3Service from '../../../../src/services/S3Service';
import StorageKey from '../../../../src/utils/StorageKey';

describe('S3Service', () => {
  config.services.s3.bucket = 'awsbucket';

  describe('init()', () => {
    it('should return an instance of AWS.S3', done => {
      const s3 = new S3Service(config);
      const result = s3.init(config);
      expect(result).to.be.an.instanceOf(AWS.S3);
      done();
    });
  });

  describe('downloadParams()', () => {
    it('should return the correct params', done => {
      const filename = '9e5eb809-bce7-463e-8c2f-b6bd8c4832d9';
      const processKey = 'test-process-key';
      const fileVersion = 'clean';
      const s3 = new S3Service(config);
      const params = s3.downloadParams(config, processKey, fileVersion, filename);

      expect(params).to.deep.equal({
        Bucket: config.services.s3.bucket,
        Key: StorageKey.format(processKey, fileVersion, filename)
      });

      done();
    });
  });

  describe('uploadParams()', () => {
    it('should return the correct params', done => {
      config.services.s3.sseKmsKeyId = 'keyid123';

      const file = Object.assign(testFile, {
        filename: '9e5eb809-bce7-463e-8c2f-b6bd8c4832d9',
        buffer: new Buffer('some file contents')
      });
      const processKey = 'test-process-key';
      const s3 = new S3Service(config);
      const params = s3.uploadParams(config, processKey, file);

      expect(params).to.deep.equal({
        Bucket: config.services.s3.bucket,
        Key: StorageKey.format(processKey, file.version, file.filename),
        Body: file.buffer,
        ServerSideEncryption: config.services.s3.serverSideEncryption,
        SSEKMSKeyId: config.services.s3.sseKmsKeyId,
        ContentType: file.mimetype,
        Metadata: {
          originalfilename: file.originalname,
          processedtime: file.processedTime.toString()
        }
      });

      done();
    });
  });

  describe('deleteParams()', () => {
    it('should return the correct params', done => {
      const filename = '9e5eb809-bce7-463e-8c2f-b6bd8c4832d9';
      const processKey = 'test-process-key';
      const s3 = new S3Service(config);
      const params = s3.deleteParams(config, processKey, filename);

      expect(params).to.deep.equal({
        Bucket: config.services.s3.bucket,
        Delete: {
          Objects: Object.values(config.fileVersions).map(version => ({
            Key: StorageKey.format(processKey, version, filename)
          })),
          Quiet: true
        }
      });

      done();
    });
  });

  describe('downloadFile()', () => {
    it('should call fetchAsync() with the correct params', done => {
      const filename = 'text-file.txt';
      const s3 = new S3Service(config);

      s3.downloadParams = sinon.stub().returns({Bucket: config.services.s3.bucket});
      s3.fetchAsync = sinon.spy();

      s3.downloadFile(filename);
      expect(s3.downloadParams).to.have.been.calledOnce;
      expect(s3.downloadParams).to.have.been.calledWith(config, filename);
      expect(s3.fetchAsync).to.have.been.calledOnce;
      expect(s3.fetchAsync).to.have.been.calledWith('getObject', {Bucket: config.services.s3.bucket});
      done();
    });
  });

  describe('uploadFile()', () => {
    it('should call fetchAsync() with the correct params', done => {
      const file = {originalname: 'text-file.txt'};
      const s3 = new S3Service(config);

      s3.uploadParams = sinon.stub().returns({Bucket: config.services.s3.bucket});
      s3.fetchAsync = sinon.spy();

      s3.uploadFile(file);
      expect(s3.uploadParams).to.have.been.calledOnce;
      expect(s3.uploadParams).to.have.been.calledWith(config, file);
      expect(s3.fetchAsync).to.have.been.calledOnce;
      expect(s3.fetchAsync).to.have.been.calledWith('upload', {Bucket: config.services.s3.bucket});
      done();
    });
  });

  describe('deleteFiles()', () => {
    it('should call fetchAsync() with the correct params', done => {
      const processKey = 'test-process-key';
      const filename = '9e5eb809-bce7-463e-8c2f-b6bd8c4832d9';
      const s3 = new S3Service(config);

      s3.deleteParams = sinon.stub().returns({Bucket: config.services.s3.bucket});
      s3.fetchAsync = sinon.spy();

      s3.deleteFiles(processKey, filename);
      expect(s3.deleteParams).to.have.been.calledOnce;
      expect(s3.deleteParams).to.have.been.calledWith(config, processKey, filename);
      expect(s3.fetchAsync).to.have.been.calledOnce;
      expect(s3.fetchAsync).to.have.been.calledWith('deleteObjects', {Bucket: config.services.s3.bucket});
      done();
    });
  });

  describe('fetchAsync()', () => {
    it('should call util.promisify()', done => {
      const util = {
        promisify: sinon.stub().returns(() => true)
      };
      const s3 = new S3Service(config, util);

      s3.fetchAsync('upload', {file: {}});
      expect(s3.util.promisify).to.have.been.calledOnce;

      done();
    });
  });
});
