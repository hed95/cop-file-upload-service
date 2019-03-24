# File upload service

## Introduction

A service built with [NodeJS](https://nodejs.org) and [TypeScript](https://www.typescriptlang.org) to upload and download files to/from a storage service.

The service performs the following actions on the uploaded files:

- validation
- virus scanning
- file conversion
  - if a virus is found and the file is an image or a pdf then the file is converted into a different format twice to remove the virus
  - if a virus is not found and the file is a pdf then it is converted to an image for ocr
- extracting text with ocr
  - valid files for ocr are: for .png, .jpg, .jpeg, .jpe, .tiff, .tif, .bmp, .pnm and .jfif
- saving into storage
  - currently S3 is supported

## Using the API

### Uploading a file

```
POST /files/{processKey}
```

#### Parameters

file: The file to be uploaded

processKey: The process key of the uploaded file

#### Responses

200: application/json

```
{
  url: Relative path of the file
  name: Original file name
  size: Size of the file
}
```

404: application/json

```
{
  error: 'Route not found'
}
```

500: application/json

```
{
  error: 'Failed to upload file'
}
```

### Downloading a file

```
GET /files/{processKey}/{fileVersion}/{filename}
```

#### Parameters

processKey: The process key of the file to be downloaded

fileVersion: The version of the file to be downloaded. Will be one of: `orig`, `clean` or `ocr`

filename: The name of the file to be downloaded

#### Responses

200: image/jpeg, image/png, application/pdf etc.

404: application/json

```
{
  error: 'Route not found'
}
```

500: application/json

```
{
  error: 'Failed to download file'
}
```

### Deleting a file

```
DELETE /files/{processKey}/{filename}
```

#### Parameters

processKey: The process key of the file to be deleted

filename: The name of the file to be deleted

#### Responses

200: application/json

```
{
  message: 'Files deleted successfully'
}
```

404: application/json

```
{
  error: 'Route not found'
}
```

500: application/json

```
{
  error: 'Failed to delete files'
}
```

## Installing the app

- Clone the repo:

  ```
  git clone git@github.com:UKHomeOffice/file-upload-service.git
  ```

- Change the directory to `file-upload-service`:

  ```
  cd file-upload-service
  ```

- Copy `.env.example` to `.env` and replace the default values with sensible ones

## Running the app with docker

- Install [Docker](https://www.docker.com)

- Start the docker containers with:

  ```
  docker-compose up
  ```

## Running the app manually

- Install the dependencies:

  ```
  npm install
  ```

- Install [Tesseract OCR](https://github.com/tesseract-ocr/tesseract)

  ```
  brew install tesseract
  ```

- Install [GraphicsMagick](http://www.graphicsmagick.org)

  ```
  brew install graphicsmagick
  ```

- Install [Ghostscript](https://www.ghostscript.com)

  ```
  brew install gs
  ```

- Start the app:

  ```
  npm start
  ```

- Run the virus scanning mock service in a new terminal window:

  ```
  npm run mocks
  ```

## Code quality

We're using [TSLint](https://palantir.github.io/tslint/) to ensure a consistent code style.

The linter can be run with:

```
npm run linter
````

## Testing

All tests can be run with:

```
npm test
```

Individual tests can be run with:

- Unit tests

  ```
  npm run test:unit
  ```

- Route tests

  ```
  npm run test:route
  ```

- Route auth tests

  ```
  npm run test:route-auth
  ```

## Test coverage

We're using [Istanbul](https://istanbul.js.org) to check the test coverage.

Test coverage reports can be generated with:

```
npm run coverage
```
