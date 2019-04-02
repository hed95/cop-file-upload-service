declare module Express {
  export interface Request {
    logger: any;
    file: Multer.File;
    uuid: any;
  }

  namespace Multer {
    export interface File {
      originalMimeType: string;
      processedTime: number;
      version: string;
    }
  }
}
