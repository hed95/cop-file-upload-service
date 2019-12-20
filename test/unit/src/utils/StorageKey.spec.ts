import StorageKey from '../../../../src/utils/StorageKey';
import {config, expect} from '../../../setupTests';

describe('StorageKey', () => {
  describe('format()', () => {
    it('should return a storage key in the correct format', (done) => {
      const fileVersion = config.fileVersions.clean;
      const filename = '9e5eb809-bce7-463e-8c2f-b6bd8c4832d9';
      const businessKey = 'BF-20191218-798';
      const storageKey = StorageKey.format({fileVersion, filename, businessKey});
      expect(storageKey).to.equal(`${businessKey}/${fileVersion}/${filename}`);
      done();
    });
  });
});
