/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');

module.exports = {
  assets: ['./src/assets/fonts/'],
  dependencies: {
    'react-native-randombytes': {
      root: path.dirname(require.resolve('react-native-randombytes/package.json'))
    }
  }
};
