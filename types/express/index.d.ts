declare module Express {
  export interface Request {
    allFiles: {[key: string]: Multer.File};
    logger: any;
    file: Multer.File;
    uuid: string;
    processedTime: number;
    kauth: any;
  }

  namespace Multer {
    export interface File {
      originalMimeType: string;
      processedTime: number;
      version: string;
    }
  }
}
