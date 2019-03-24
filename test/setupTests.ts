import * as chai from 'chai';
import {expect} from 'chai';
import 'chai-http';
import * as nock from 'nock';
import * as httpMocks from 'node-mocks-http';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import config from '../src/config';

const chaiHttp = require('chai-http');

chai.use(sinonChai);
chai.use(chaiHttp);

const testFile = {
  buffer: new Buffer('test file content'),
  destination: '',
  encoding: '7bit',
  fieldname: 'file',
  filename: '',
  mimetype: 'application/octet-stream',
  originalMimeType: 'image/png',
  originalname: 'test-file.txt',
  path: '',
  processedTime: 1553181662189,
  size: 5,
  version: config.fileVersions.original
};

const validateMock = class {
  public static validateFields() {
    return null;
  }
};

const requestMock = httpMocks.createRequest;
const responseMock = httpMocks.createResponse;

export {
  chai,
  config,
  expect,
  nock,
  requestMock,
  responseMock,
  sinon,
  testFile,
  validateMock
};
