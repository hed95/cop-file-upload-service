import * as chai from 'chai';
import {expect} from 'chai';
import 'chai-http';
import * as nock from 'nock';
import * as httpMocks from 'node-mocks-http';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import config from '../src/config';

chai.use(sinonChai);
chai.use(require('chai-http'));

const testFile: Express.Multer.File = {
  destination: '',
  encoding: '7bit',
  fieldname: 'file',
  filename: '',
  mimetype: 'application/pdf',
  originalMimeType: 'application/pdf',
  originalname: 'test-file.pdf',
  path: '',
  processedTime: 1553181662189,
  size: 13557,
  version: config.fileVersions.original
};

const validateMock = class {
  public static validateFields() {
    return null;
  }
};

const fileServiceMock = class {
  public readFile() {
    return new Buffer('some file contents');
  }

  public writeFile() {
    return true;
  }
};

const requestMock = httpMocks.createRequest;
const responseMock = httpMocks.createResponse;

export {
  chai,
  config,
  expect,
  fileServiceMock,
  nock,
  requestMock,
  responseMock,
  sinon,
  testFile,
  validateMock
};
