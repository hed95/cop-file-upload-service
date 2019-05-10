interface IOcr {
  ocr: any;
  getText(fileContents: Buffer): Promise<string>;
}

export default IOcr;
