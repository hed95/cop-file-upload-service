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
  size: 5
};

export {
  chai,
  config,
  expect,
  nock,
  sinon,
  testFile
};
