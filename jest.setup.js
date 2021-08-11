import { Buffer as ImportedBuffer } from 'buffer';
import 'react-native-gesture-handler/jestSetup';

export const mockCrypto = {
  getRandomValues: jest.fn()
};

global.crypto = mockCrypto;

global.Buffer = global.Buffer || ImportedBuffer;

if (typeof btoa === 'undefined') {
  global.btoa = function (str) {
    return global.Buffer.from(str, 'binary').toString('base64');
  };
}

if (typeof atob === 'undefined') {
  global.atob = function (b64Encoded) {
    return global.Buffer.from(b64Encoded, 'base64').toString('binary');
  };
}

import './src/mocks/native-modules.mock';

import './src/mocks/react-native-async-storage.mock';
import './src/mocks/react-native-bootsplash.mock';
import './src/mocks/react-native-device-info.mock';
import './src/mocks/react-native-permissions.mock';
import './src/mocks/react-native-screens.mock';
import './src/mocks/react-native-reanimated.mock';
import './src/mocks/react-native-quick-actions.mock';
