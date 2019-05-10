class FileType {
  public static isValidFileTypeForConversion(mimeType: string): boolean {
    if (mimeType.includes('image/')) {
      return true;
    } else if (mimeType === 'application/pdf') {
      return true;
    } else if (mimeType.includes('word')) {
      return true;
    }
    return false;
  }

  public static isValidFileTypeForOcr(fileType: string): boolean {
    return ['png', 'jpeg', 'tiff', 'bmp', 'x-portable-anymap', 'pipeg', 'pdf'].includes(fileType);
  }

  public static fileType(mimeType: string): string {
    return this.fileTypeParts(mimeType)[1];
  }

  public static fileTypeParts(mimeType: string): string[] {
    return mimeType.split('/');
  }
}

export default FileType;
