class StorageKey {
  static format(processKey, fileVersion, filename) {
    return `${processKey}/${fileVersion}/${filename}`;
  }
}

export default StorageKey;
