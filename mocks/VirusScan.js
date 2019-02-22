// const config = require('../src/config');

// const {virusScan} = config.services;

const mock = {
  // path: `${virusScan.url}:${virusScan.port}${virusScan.path}`,
  path: '/scan',
  method: 'POST',
  template: {
    text: 'true'
  }
};

module.exports = mock;
