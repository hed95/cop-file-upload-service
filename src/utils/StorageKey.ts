import IS3StorageKeyParams from '../interfaces/IS3StorageKeyParams';

class StorageKey {
  public static format(params: IS3StorageKeyParams): string {
    const {processKey, fileVersion, filename}: IS3StorageKeyParams = params;
    return `${processKey}/${fileVersion}/${filename}`;
  }
}

export default StorageKey;
