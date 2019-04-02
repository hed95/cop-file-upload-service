import FileConverter from '../../../../src/utils/FileConverter';
import {config, expect, sinon, testFile} from '../../../setupTests';

describe('FileConverter', () => {
  let gm: any;
  let util: any;
  let file: Express.Multer.File;

  beforeEach(() => {
    gm = sinon.stub().returns({
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
      const fileConverter: FileConverter = new FileConverter(gm, util, config);
      fileConverter.fetchFileBuffer(file, newFileType);
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
      expect(newMimeType).to.deep.equal(['image/png', 'png']);
      done();
    });

    it('should return the correct MIME type when the current MIME type is neither image/jpeg or application/pdf', (done) => {
      const currentMimeType: string = 'image/png';
      const originalMimeType: string = 'image/png';
      const fileConverter: FileConverter = new FileConverter(gm, util, config);
      const newMimeType: string[] = fileConverter.newMimeType(currentMimeType, originalMimeType);
      expect(newMimeType).to.deep.equal(['image/jpeg', 'jpg']);
      done();
    });

    it('should return the correct MIME type when the new MIME type matches the original MIME type', (done) => {
      const currentMimeType: string = 'image/png';
      const originalMimeType: string = 'image/jpeg';
      const fileConverter: FileConverter = new FileConverter(gm, util, config);
      const newMimeType: string[] = fileConverter.newMimeType(currentMimeType, originalMimeType);
      expect(newMimeType).to.deep.equal(['image/tiff', 'tif']);
      done();
    });
  });

  describe('fetchFile()', () => {
    it('should return the correct file', (done) => {
      const fileConverter: FileConverter = new FileConverter(gm, util, config);

      fileConverter.fetchFileBuffer = sinon.stub().returns(file.buffer);

      fileConverter
        .fetchFile(file)
        .then((res) => {
          expect(res).to.deep.equal({mimetype: 'image/tiff', buffer: file.buffer});
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

      fileConverter.fetchFile = (res) => {
        if (res.mimetype === 'image/jpeg') {
          return Promise.resolve({mimetype: 'image/png', buffer: res.buffer});
        }
        return Promise.resolve({mimetype: 'image/tiff', buffer: res.buffer});
      };

      fileConverter
        .convert(file, logger, config.fileConversions.count)
        .then((res) => {
          expect(logger).to.have.been.calledThrice;
          expect(logger).to.have.been.calledWith('Converting file 2 times');
          expect(logger).to.have.been.calledWith('File converted from image/jpeg to image/png');
          expect(logger).to.have.been.calledWith('File converted from image/png to image/tiff');
          expect(res).to.deep.equal({
            ...testFile,
            ...{
              buffer: new Buffer('some file contents'),
              mimetype: 'image/tiff',
              originalMimeType: 'image/jpeg'
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
