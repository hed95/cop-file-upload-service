import FileConverter from '../../../../src/utils/FileConverter';
import {config, expect, sinon, testFile} from '../../../setupTests';

describe('FileConverter', () => {
  let util: any;
  let file: Express.Multer.File;
  const fileConverterMock: any = class {
    public fetchFileBuffer() {
      return new Buffer('some file contents');
    }
  };

  beforeEach(() => {
    util = {
      promisify: sinon.stub().returns(() => true)
    };
    file = {
      ...testFile,
      ...{
        buffer: new Buffer('some file contents'),
        mimetype: 'image/jpeg',
        originalMimeType: 'image/png'
      }
    };
  });

  describe('newMimeType()', () => {
    it('should return the correct MIME type when currentMimeType matches originalMimeType and there is a mapped value', (done) => {
      const currentMimeType: string = 'application/pdf';
      const originalMimeType: string = 'application/pdf';
      const fileConverter: FileConverter = new FileConverter(util, config, fileConverterMock, fileConverterMock);
      const newMimeType: string[] = fileConverter.newMimeType(currentMimeType, originalMimeType);
      expect(newMimeType).to.deep.equal(['image/tiff', 'tiff', fileConverterMock]);
      done();
    });

    it('should return the correct MIME type when currentMimeType matches originalMimeType and there is no mapped value', (done) => {
      const currentMimeType: string = 'image/tiff';
      const originalMimeType: string = 'image/tiff';
      const fileConverter: FileConverter = new FileConverter(util, config, fileConverterMock, fileConverterMock);
      const newMimeType: string[] = fileConverter.newMimeType(currentMimeType, originalMimeType);
      expect(newMimeType).to.deep.equal(['image/jpeg', 'jpeg', fileConverterMock]);
      done();
    });

    it('should return the correct MIME type when currentMimeType does not match originalMimeType', (done) => {
      const currentMimeType: string = 'image/tiff';
      const originalMimeType: string = 'application/pdf';
      const fileConverter: FileConverter = new FileConverter(util, config, fileConverterMock, fileConverterMock);
      const newMimeType: string[] = fileConverter.newMimeType(currentMimeType, originalMimeType);
      expect(newMimeType).to.deep.equal(['application/pdf', 'pdf', fileConverterMock]);
      done();
    });

    it('should return the correct MIME type when currentMimeType does not match originalMimeType and originalMimeType includes word', (done) => {
      const currentMimeType: string = 'application/pdf';
      const originalMimeType: string = 'application/msword';
      const fileConverter: FileConverter = new FileConverter(util, config, fileConverterMock, fileConverterMock);
      const newMimeType: string[] = fileConverter.newMimeType(currentMimeType, originalMimeType);
      expect(newMimeType).to.deep.equal(['image/tiff', 'tiff', fileConverterMock]);
      done();
    });
  });

  describe('fetchFile()', () => {
    it('should return the correct file', (done) => {
      const fileConverter: any = new FileConverter(util, config, fileConverterMock, fileConverterMock);

      fileConverter.newMimeType = sinon.stub().returns(['application/pdf', 'pdf', fileConverterMock]);
      fileConverterMock.fetchFileBuffer = sinon.stub().returns(file.buffer);

      fileConverter
        .fetchFile(file)
        .then((res) => {
          expect(res).to.deep.equal({
            buffer: file.buffer,
            mimetype: 'application/pdf',
            version: config.fileVersions.clean
          });
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('convert()', () => {
    it('should return a correctly converted file', (done) => {
      const logger: sinon.SinonSpy = sinon.spy();
      const fileConverter: FileConverter = new FileConverter(util, config, fileConverterMock, fileConverterMock);

      fileConverter.fetchFile = (res) => Promise.resolve({
        buffer: res.buffer,
        mimetype: 'image/png',
        version: config.fileVersions.clean
      });

      fileConverter
        .convert(file, logger)
        .then((res) => {
          expect(logger).to.have.been.calledTwice;
          expect(logger).to.have.been.calledWith('Converting file');
          expect(logger).to.have.been.calledWith('File converted from image/jpeg to image/png');
          expect(res).to.deep.equal({
            ...testFile,
            ...{
              buffer: new Buffer('some file contents'),
              mimetype: 'image/png',
              originalMimeType: 'image/png',
              version: config.fileVersions.clean
            }
          });
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
