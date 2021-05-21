import 'react-native-gesture-handler/jestSetup';

global.crypto = {
  getRandomValues: jest.fn()
};

import './src/mocks/react-native-async-storage.mock';
import './src/mocks/react-native-bootsplash.mock';
import './src/mocks/react-native-screens.mock';
import './src/mocks/react-native-reanimated.mock';
