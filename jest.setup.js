import { decode, encode } from 'base-64';
import 'react-native-gesture-handler/jestSetup';

if (typeof btoa === 'undefined') {
  global.btoa = encode;
}

if (typeof atob === 'undefined') {
  global.atob = decode;
}

import './src/mocks/mem.mock';
import './src/mocks/crypto.mock';

import './src/mocks/native-modules.mock';

import './src/mocks/react-native-async-storage.mock';
import './src/mocks/react-native-bootsplash.mock';
import './src/mocks/react-native-clipboard-clipboard.mock';
import './src/mocks/react-native-device-info.mock';
import './src/mocks/react-native-permissions.mock';
import './src/mocks/react-native-screens.mock';
import './src/mocks/react-native-reanimated.mock';
import './src/mocks/react-native-quick-actions.mock';
import './src/mocks/react-native-toast-message.mock';
import './src/mocks/tezos.mock';
