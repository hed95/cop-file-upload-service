class FileType {
  public static isValidFileTypeForConversion(mimeType: string): boolean {
    if (this.fileTypeGroup(mimeType) === 'image') {
      return true;
    } else if (mimeType === 'application/pdf') {
      return true;
    }
    return false;
  }

  public static isValidFileTypeForOcr(fileType: string): boolean {
    return ['png', 'jpeg', 'tiff', 'bmp', 'x-portable-anymap', 'pipeg'].includes(fileType);
  }

  public static fileType(mimeType: string): string {
    return this.fileTypeParts(mimeType)[1];
  }

  public static fileTypeGroup(mimeType: string): string {
    return this.fileTypeParts(mimeType)[0];
  }

  public static fileTypeParts(mimeType: string): string[] {
    return mimeType.split('/');
  }
}

export default FileType;
