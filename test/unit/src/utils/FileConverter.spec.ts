import FileConverter from '../../../../src/utils/FileConverter';
import {config, expect, sinon, testFile} from '../../../setupTests';

describe('FileConverter', () => {
  let gm: any;
  let util: any;
  let file: Express.Multer.File;

  beforeEach(() => {
    gm = sinon.stub().returns({
      command: sinon.spy(),
      density: sinon.spy(),
      toBuffer: sinon.spy()
    });
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

  describe('initGm()', () => {
    it('should call gm() when given a MIME type other than application/pdf', (done) => {
      const fileConverter: FileConverter = new FileConverter(gm, util, config);
      fileConverter.initGm(file);
      expect(fileConverter.gm).to.have.been.calledOnce;
      expect(fileConverter.gm).to.have.been.calledWith(file.buffer, file.originalname);
      done();
    });

    it('should call gm() when given a MIME type of application/pdf', (done) => {
      file.mimetype = 'application/pdf';
      const fileConverter: FileConverter = new FileConverter(gm, util, config);
      fileConverter.initGm(file);
      expect(fileConverter.gm).to.have.been.calledOnce;
      expect(fileConverter.gm).to.have.been.calledWith(file.buffer, file.originalname);
      done();
    });
  });

  describe('fetchFileBuffer()', () => {
    it('should call gm() and util.promisify()', (done) => {
      const newFileType: string = 'png';
      const logger = () => true;
      const fileConverter: FileConverter = new FileConverter(gm, util, config);
      fileConverter.fetchFileBuffer(file, newFileType, logger);
      expect(fileConverter.gm).to.have.been.calledOnce;
      expect(fileConverter.gm).to.have.been.calledWith(file.buffer, file.originalname);
      expect(fileConverter.util.promisify).to.have.been.calledOnce;
      done();
    });
  });

  describe('newMimeType()', () => {
    it('should return the correct MIME type when the current MIME type is image/jpeg', (done) => {
      const currentMimeType: string = 'image/jpeg';
      const originalMimeType: string = 'image/jpeg';
      const fileConverter: FileConverter = new FileConverter(gm, util, config);
      const newMimeType: string[] = fileConverter.newMimeType(currentMimeType, originalMimeType);
      expect(newMimeType).to.deep.equal(['image/png', 'png']);
      done();
    });

    it('should return the correct MIME type when the current MIME type is application/pdf', (done) => {
      const currentMimeType: string = 'application/pdf';
      const originalMimeType: string = 'application/pdf';
      const fileConverter: FileConverter = new FileConverter(gm, util, config);
      const newMimeType: string[] = fileConverter.newMimeType(currentMimeType, originalMimeType);
      expect(newMimeType).to.deep.equal(['image/tiff', 'tif']);
      done();
    });

    it('should return the correct MIME type when the current MIME type is neither image/jpeg or application/pdf', (done) => {
      const currentMimeType: string = 'image/png';
      const originalMimeType: string = 'image/png';
      const fileConverter: FileConverter = new FileConverter(gm, util, config);
      const newMimeType: string[] = fileConverter.newMimeType(currentMimeType, originalMimeType);
      expect(newMimeType).to.deep.equal(['image/jpeg', 'jpeg']);
      done();
    });

    it('should return the original MIME type when the current MIME type does not match the original MIME type', (done) => {
      const currentMimeType: string = 'image/png';
      const originalMimeType: string = 'image/jpeg';
      const fileConverter: FileConverter = new FileConverter(gm, util, config);
      const newMimeType: string[] = fileConverter.newMimeType(currentMimeType, originalMimeType);
      expect(newMimeType).to.deep.equal(['image/jpeg', 'jpeg']);
      done();
    });
  });

  describe('fetchFile()', () => {
    it('should return the correct file', (done) => {
      const logger = () => true;
      const fileConverter: FileConverter = new FileConverter(gm, util, config);

      fileConverter.fetchFileBuffer = sinon.stub().returns(file.buffer);

      fileConverter
        .fetchFile(file, logger)
        .then((res) => {
          expect(res).to.deep.equal({
            buffer: file.buffer,
            mimetype: 'image/png',
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
      const fileConverter: FileConverter = new FileConverter(gm, util, config);

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
