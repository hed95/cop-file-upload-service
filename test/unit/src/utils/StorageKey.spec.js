import {config, expect} from '../../../setupTests';

import StorageKey from '../../../../src/utils/StorageKey';

describe('StorageKey', () => {
  describe('format()', () => {
    it('should return a storage key in the correct format', (done) => {
      const processKey = 'test-process-key';
      const fileVersion = config.fileVersions.clean;
      const filename = '9e5eb809-bce7-463e-8c2f-b6bd8c4832d9';
      const storageKey = StorageKey.format(processKey, fileVersion, filename);
      expect(storageKey).to.equal(`${processKey}/${fileVersion}/${filename}`);
      done();
    });
  });
});
