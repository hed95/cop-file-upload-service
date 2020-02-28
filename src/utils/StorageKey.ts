import IS3MetadataContent from '../interfaces/IS3MetadataContent';
import IS3StorageKeyParams from '../interfaces/IS3StorageKeyParams';

class StorageKey {
  public static format(params: IS3StorageKeyParams): string {
    const {businessKey, fileVersion, filename}: IS3StorageKeyParams = params;
    return `${businessKey}/${fileVersion}/${filename}`;
  }

  public static get(Contents: IS3MetadataContent[], ETag: string): string {
    return Contents.filter((content: IS3MetadataContent): boolean => {
      return content.ETag === ETag;
    })[0].Key;
  }
}

export default StorageKey;
