import ImageOcr from '../../../../src/utils/ImageOcr';
import {expect, sinon, testFile} from '../../../setupTests';

describe('ImageOcr', () => {
  describe('getText', () => {
    it('should return correctly formatted text', async () => {
      const ocrStub = sinon.stub().returns('   some file contents     ');
      const buffer = new Buffer('');
      const imageOcr = new ImageOcr(ocrStub);
      const text = await imageOcr.getText(buffer);

      expect(text).to.equal('some file contents');
    });
  });
});
