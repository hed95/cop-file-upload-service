import * as fs from 'fs';
import config from '../config';

class FileService {
  public writeFile(fileVersion: string, filename: string, fileBuffer: Buffer): boolean {
    const filePath: string = this.filePath(fileVersion, filename);
    fs.writeFileSync(filePath, fileBuffer);
    return true;
  }

  public readFile(fileVersion: string, filename: string): Buffer {
    const filePath: string = this.filePath(fileVersion, filename);
    return fs.readFileSync(filePath);
  }

  public filePath(fileVersion: string, filename: string): string {
    return `${config.uploadDirectory}/${fileVersion}${config.fileConversions.token}${filename}`;
  }
}

export default FileService;
