import {NextFunction, Request, Response} from 'express';
import MetadataController from '../../../../src/controllers/MetadataController';
import {expect, requestMock, responseMock, sinon} from '../../../setupTests';

describe('MetadataController', () => {
  describe('generateMetadata()', () => {
    it('should generate the mertadata', (done) => {
      const processedTime: number = Date.now();
      const req: Request = requestMock({
        file: {},
        uuid: '9e5eb809-bce7-463e-8c2f-b6bd8c4832d9'
      });
      const res: Response = responseMock();
      const next: NextFunction = sinon.spy();
      const metadataController: MetadataController = new MetadataController(processedTime);

      metadataController.generateMetadata(req, res, next);

      expect(req.file).to.deep.equal({
        filename: req.uuid,
        processedTime
      });

      done();
    });
  });
});
