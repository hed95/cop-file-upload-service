import IOcr from '../interfaces/IOcr';

class PdfOcr implements IOcr {
  public ocr: any;

  constructor(ocr: any) {
    this.ocr = ocr;
  }

  public async getText(fileContents: Buffer): Promise<string> {
    const pdf: {text: string} = await this.ocr(fileContents);
    return pdf.text.trim();
  }
}

export default PdfOcr;
