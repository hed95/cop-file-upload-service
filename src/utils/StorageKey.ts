import IS3StorageKeyParams from '../interfaces/IS3StorageKeyParams';

class StorageKey {
  public static format(params: IS3StorageKeyParams): string {
    const {businessKey, fileVersion, filename}: IS3StorageKeyParams = params;
    return `${businessKey}/${fileVersion}/${filename}`;
  }
}

export default StorageKey;
