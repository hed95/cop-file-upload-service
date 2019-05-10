import IOcr from '../interfaces/IOcr';

class ImageOcr implements IOcr {
  public ocr: any;

  constructor(ocr: any) {
    this.ocr = ocr;
  }

  public async getText(fileContents: Buffer): Promise<string> {
    const text: string = await this.ocr(fileContents);
    return text.trim();
  }
}

export default ImageOcr;
