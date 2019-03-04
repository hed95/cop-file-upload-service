# File upload service

## Introduction

A service built with [NodeJS](https://nodejs.org) to upload and download files to/from a storage service. The service performs the following actions on the uploaded files:

- validation
- virus scanning
- extracting text with ocr (for .png, .jpg, .jpeg, .jpe, .tiff, .tif, .bmp, .pnm or .jfif)
- saving into storage

Currently S3 is supported for storage.

## Using the API

### Uploading a file

```
POST /files
```

#### Parameters

file: The file to be uploaded

processKey: The process key of the uploaded file

#### Responses

200: application/json

```
{
  message: 'File uploaded successfully'
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
GET /files/:processKey/:fileVersion/:filename
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

## Installing and running the app

- Clone the repo:

  ```
  git clone git@github.com:UKHomeOffice/file-upload-service.git
  ```

- Change the directory to `file-upload-service`:

  ```
  cd file-upload-service
  ```

- Install the dependencies:

  ```
  npm install
  ```

- Copy `.env.example` to `.env` and replace the default values with sensible ones

- Install [Tesseract OCR](https://github.com/tesseract-ocr/tesseract)

  ```
  brew install tesseract
  ```

- Install [GraphicsMagick](http://www.graphicsmagick.org)

  ```
  brew install graphicsmagick
  ```

- Start the app:

  ```
  npm run dev
  ```

  In dev mode the app is started with [nodemon](https://www.npmjs.com/package/nodemon), which will automatically restart the app when file changes are detected.

- Start the virus scanning service in a new terminal window:

  Either run the mocks:

  ```
  npm run mocks
  ```

  Or install [Docker](https://www.docker.com) and then start the docker containers with:

  ```
  docker-compose up
  ```

## Code quality

We're using [ESLint](https://eslint.org) to ensure a consistent code style.

The linter can be run with:

```
npm run eslint
````

## Testing

Unit tests can be run with:

```
npm run test:unit
```

Route tests can be run with:

```
npm run test:route
```

Both unit and route tests can be run with:

```
npm run test
```

## Test coverage

We're using [Istanbul](https://istanbul.js.org) to check the test coverage.

Test coverage reports can be generated with:

```
npm run coverage
```
