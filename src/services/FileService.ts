import * as fs from 'fs';
import config from '../config';

class FileService {
  public writeFile(fileVersion: string, filename: string, fileBuffer: Buffer): boolean {
    const filePath: string = this.formatFilePath(fileVersion, filename);
    fs.writeFileSync(filePath, fileBuffer);
    return true;
  }

  public readFile(fileVersion: string, filename: string): Buffer {
    const filePath: string = this.formatFilePath(fileVersion, filename);
    return fs.readFileSync(filePath);
  }

  public formatFilename(fileVersion: string, filename: string): string {
    return `${filename}${config.fileConversions.token}${fileVersion}`;
  }

  public formatFilePath(fileVersion: string, filename: string): string {
    const formattedFilename: string = this.formatFilename(fileVersion, filename);
    return `${config.uploadDirectory}/${formattedFilename}`;
  }
}

export default FileService;
