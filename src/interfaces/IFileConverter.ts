interface IFileConverter {
  initFileConverter?(file: Express.Multer.File): any;
  fetchFileBuffer(file: Express.Multer.File, newFileType: string): Buffer;
}

export default IFileConverter;
