import chai, {expect} from 'chai';

import chaiHttp from 'chai-http';
import config from '../src/config';
import nock from 'nock';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);
chai.use(chaiHttp);

const testFile = {
  fieldname: 'file',
  originalname: 'test-file.txt',
  encoding: '7bit',
  mimetype: 'application/octet-stream',
  size: 5,
  version: config.fileVersions.original,
  processedTime: 1553181662189
};

const validateMock = class {
  static validateFields() {
    return null;
  }
};

export {
  chai,
  config,
  expect,
  nock,
  sinon,
  testFile,
  validateMock
};
