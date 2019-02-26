# File upload service

## Introduction

A service built with [NodeJS](https://nodejs.org) to upload and download files to/from a storage service. The service performs the following actions on the uploaded files:

- validation
- virus scanning
- extracting text with ocr
- saving into storage

Currently S3 is supported for storage.

## Using the API

### Uploading a file

```
POST /uploads
```

#### Parameters

file: The file to be uploaded

### Downloading a file

```
GET /uploads/:filename
```

#### Parameters

filename: The name of the file to be downloaded

## Installing and running the app

- Clone the repo:

  ```
  git clone git@github.com:UKHomeOffice/file-upload-service.git
  ```

- Change the directory to the `file-upload-service`:

  ```
  cd file-upload-service
  ```

- Install the dependencies:

  ```
  npm install
  ```

- Copy `.env.example` to `.env` and replace the default values with sensible ones

- Install tesseract

  ```
  brew install tesseract
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

  Or install and run the [docker-clamav-rest](https://github.com/UKHomeOffice/docker-clamav-rest) service.

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
