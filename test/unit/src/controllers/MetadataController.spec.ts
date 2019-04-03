import {NextFunction, Request, Response} from 'express';
import MetadataController from '../../../../src/controllers/MetadataController';
import {config, expect, requestMock, responseMock, sinon, testFile} from '../../../setupTests';

describe('MetadataController', () => {
  describe('generateMetadata()', () => {
    it('should generate the correct metadata', (done) => {
      const processedTime: number = Date.now();
      const req: Request = requestMock({
        file: testFile,
        uuid: '9e5eb809-bce7-463e-8c2f-b6bd8c4832d9'
      });
      const res: Response = responseMock();
      const next: NextFunction = sinon.spy();
      const metadataController: MetadataController = new MetadataController(processedTime, config);

      metadataController.generateMetadata(req, res, next);

      expect(req.file.filename).to.equal(req.uuid);
      expect(req.file.originalMimeType).to.equal(testFile.mimetype);
      expect(req.file.processedTime).to.equal(processedTime);
      expect(req.file.version).to.equal(config.fileVersions.original);
      expect(req).to.have.property('allFiles');
      expect(req.allFiles[config.fileVersions.original]).to.deep.equal(req.file);

      done();
    });
  });
});
