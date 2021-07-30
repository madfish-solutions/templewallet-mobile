import mockClipboard from '@react-native-clipboard/clipboard/jest/clipboard-mock.js';

jest.mock('@react-native-clipboard/clipboard', () => mockClipboard);
