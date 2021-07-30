import 'react-native-gesture-handler/jestSetup';

global.crypto = {
  getRandomValues: jest.fn()
};

import './src/mocks/native-modules.mock';

import './src/mocks/react-native-async-storage.mock';
import './src/mocks/react-native-bootsplash.mock';
import './src/mocks/react-native-device-info.mock';
import './src/mocks/react-native-permissions.mock';
import './src/mocks/react-native-screens.mock';
import './src/mocks/react-native-reanimated.mock';
import './src/mocks/react-native-quick-actions.mock';
import './src/mocks/react-native-clipboard.mock';
import './src/mocks/rn-fetch-blob.mock';
