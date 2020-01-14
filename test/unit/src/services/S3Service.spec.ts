import * as AWS from 'aws-sdk';
import IDeleteRequestParams from '../../../../src/interfaces/IDeleteRequestParams';
import IGetRequestParams from '../../../../src/interfaces/IGetRequestParams';
import IPostRequestParams from '../../../../src/interfaces/IPostRequestParams';
import S3DeleteParamsInterface from '../../../../src/interfaces/IS3DeleteParams';
import S3DownloadParamsInterface from '../../../../src/interfaces/IS3DownloadParams';
import S3UploadParamsInterface from '../../../../src/interfaces/IS3UploadParams';
import S3Service from '../../../../src/services/S3Service';
import StorageKey from '../../../../src/utils/StorageKey';
import {config, expect, sinon, testFile} from '../../../setupTests';

describe('S3Service', () => {
  let s3: S3Service;
  let util: any = {};
  config.services.s3.bucket = 'awsbucket';

  describe('init()', () => {
    it('should return an instance of AWS.S3', (done) => {
      s3 = new S3Service(config, util);
      const result: AWS.S3 = s3.init(config);
      expect(result).to.be.an.instanceOf(AWS.S3);
      done();
    });
  });

  describe('downloadParams()', () => {
    it('should return the correct params', (done) => {
      const requestParams: IGetRequestParams = {
        businessKey: 'BF-20191218-798',
        fileVersion: 'clean',
        filename: '9e5eb809-bce7-463e-8c2f-b6bd8c4832d9'
      };
      s3 = new S3Service(config, util);
      const downloadParams: S3DownloadParamsInterface = s3.downloadParams(config, requestParams);

      expect(downloadParams).to.deep.equal({
        Bucket: config.services.s3.bucket,
        Key: StorageKey.format(requestParams)
      });

      done();
    });
  });

  describe('uploadParams()', () => {
    it('should return the correct params', (done) => {
      const requestParams: IPostRequestParams = {
        businessKey: 'BF-20191218-798',
        file: {
          ...testFile,
          ...{
            buffer: new Buffer('some file contents'),
            filename: '9e5eb809-bce7-463e-8c2f-b6bd8c4832d9'
          }
        }
      };

      s3 = new S3Service(config, util);
      const params: S3UploadParamsInterface = s3.uploadParams(config, requestParams);

      expect(params).to.deep.equal({
        Body: requestParams.file.buffer,
        Bucket: config.services.s3.bucket,
        ContentType: requestParams.file.mimetype,
        Key: StorageKey.format({
          businessKey: requestParams.businessKey,
          fileVersion: requestParams.file.version,
          filename: requestParams.file.filename
        }),
        Metadata: {
          originalfilename: requestParams.file.originalname,
          processedtime: requestParams.file.processedTime.toString()
        }
      });

      done();
    });
  });

  describe('deleteParams()', () => {
    it('should return the correct params', (done) => {
      const requestParams: IDeleteRequestParams = {
        businessKey: 'BF-20191218-798',
        filename: '9e5eb809-bce7-463e-8c2f-b6bd8c4832d9'
      };

      s3 = new S3Service(config, util);
      const params: S3DeleteParamsInterface = s3.deleteParams(config, requestParams);

      expect(params).to.deep.equal({
        Bucket: config.services.s3.bucket,
        Delete: {
          Objects: Object.values(config.fileVersions).map((version) => ({
            Key: StorageKey.format({
              businessKey: requestParams.businessKey,
              fileVersion: version,
              filename: requestParams.filename
            })
          })),
          Quiet: true
        }
      });

      done();
    });
  });

  describe('downloadFile()', () => {
    it('should call fetchAsync() with the correct params', (done) => {
      const requestParams: IGetRequestParams = {
        businessKey: 'BF-20191218-798',
        fileVersion: 'orig',
        filename: '9e5eb809-bce7-463e-8c2f-b6bd8c4832d9'
      };

      s3 = new S3Service(config, util);

      s3.downloadParams = sinon.stub().returns({Bucket: config.services.s3.bucket});
      s3.fetchAsync = sinon.spy();

      s3.downloadFile(requestParams);
      expect(s3.downloadParams).to.have.been.calledOnce;
      expect(s3.downloadParams).to.have.been.calledWith(config, requestParams);
      expect(s3.fetchAsync).to.have.been.calledOnce;
      expect(s3.fetchAsync).to.have.been.calledWith('getObject', {Bucket: config.services.s3.bucket});
      done();
    });
  });

  describe('uploadFile()', () => {
    it('should call fetchAsync() with the correct params', (done) => {
      const requestParams: IPostRequestParams = {
        businessKey: 'BF-20191218-798',
        file: testFile
      };

      s3 = new S3Service(config, util);

      s3.uploadParams = sinon.stub().returns({Bucket: config.services.s3.bucket});
      s3.fetchAsync = sinon.spy();

      s3.uploadFile(requestParams);
      expect(s3.uploadParams).to.have.been.calledOnce;
      expect(s3.uploadParams).to.have.been.calledWith(config, requestParams);
      expect(s3.fetchAsync).to.have.been.calledOnce;
      expect(s3.fetchAsync).to.have.been.calledWith('upload', {Bucket: config.services.s3.bucket});
      done();
    });
  });

  describe('deleteFiles()', () => {
    it('should call fetchAsync() with the correct params', (done) => {
      const requestParams: IDeleteRequestParams = {
        businessKey: 'BF-20191218-798',
        filename: '9e5eb809-bce7-463e-8c2f-b6bd8c4832d9'
      };

      s3 = new S3Service(config, util);

      s3.deleteParams = sinon.stub().returns({Bucket: config.services.s3.bucket});
      s3.fetchAsync = sinon.spy();

      s3.deleteFiles(requestParams);
      expect(s3.deleteParams).to.have.been.calledOnce;
      expect(s3.deleteParams).to.have.been.calledWith(config, requestParams);
      expect(s3.fetchAsync).to.have.been.calledOnce;
      expect(s3.fetchAsync).to.have.been.calledWith('deleteObjects', {Bucket: config.services.s3.bucket});
      done();
    });
  });

  describe('fetchAsync()', () => {
    it('should call util.promisify()', (done) => {
      util = {
        promisify: sinon.stub().returns(() => true)
      };
      s3 = new S3Service(config, util);

      s3.fetchAsync('upload', {file: {}});
      expect(s3.util.promisify).to.have.been.calledOnce;

      done();
    });
  });
});
