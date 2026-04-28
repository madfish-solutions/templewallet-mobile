/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');

module.exports = {
  assets: ['./src/assets/fonts/', './src/assets/sapling-spend.params', './src/assets/sapling-output.params'],
  dependencies: {
    'react-native-randombytes': {
      root: path.dirname(require.resolve('react-native-randombytes/package.json'))
    }
  }
};
