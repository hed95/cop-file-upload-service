# File upload service

## Introduction

File upload service built with [NodeJS](https://nodejs.org) which accepts a file, performs validation, runs a virus scan and stores the files in S3.

## Installing and running the app

- Clone the repo:

  ```
  git clone ...
  ```

- Install dependencies:

  ```
  npm install
  ```

- Copy `.env.example` to `.env` and replace the default values with sensible ones

- Start the app:

  ```
  npm run dev
  ```

  In dev mode the app is started with [nodemon](https://www.npmjs.com/package/nodemon), which will automatically restart the app when file changes are detected.

- Start the mocks in a new terminal window:

  ```
  npm run mocks
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
