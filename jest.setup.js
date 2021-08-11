import { decode, encode } from 'base-64';
import 'react-native-gesture-handler/jestSetup';

export const mockCrypto = {
  getRandomValues: jest.fn()
};

global.crypto = mockCrypto;

if (typeof btoa === 'undefined') {
  global.btoa = encode;
}

if (typeof atob === 'undefined') {
  global.atob = decode;
}

import './src/mocks/native-modules.mock';

import './src/mocks/react-native-async-storage.mock';
import './src/mocks/react-native-bootsplash.mock';
import './src/mocks/react-native-device-info.mock';
import './src/mocks/react-native-permissions.mock';
import './src/mocks/react-native-screens.mock';
import './src/mocks/react-native-reanimated.mock';
import './src/mocks/react-native-quick-actions.mock';
