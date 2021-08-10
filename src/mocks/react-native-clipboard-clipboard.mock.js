export const mockSetString = jest.fn();

jest.mock('@react-native-clipboard/clipboard', () => ({
  ...jest.requireActual('@react-native-clipboard/clipboard'),
  setString: mockSetString
}));
