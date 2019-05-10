import PdfOcr from '../../../../src/utils/PdfOcr';
import {expect, sinon} from '../../../setupTests';

describe('PdfOcr', () => {
  describe('getText', () => {
    it('should return correctly formatted text', async () => {
      const ocrStub = sinon.stub().returns({text: '   some file contents     '});
      const buffer = new Buffer('');
      const pdfOcr = new PdfOcr(ocrStub);
      const text = await pdfOcr.getText(buffer);

      expect(text).to.equal('some file contents');
    });
  });
});
