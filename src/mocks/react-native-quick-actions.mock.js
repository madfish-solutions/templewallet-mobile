jest.mock('react-native-quick-actions', () => ({
  popInitialAction: jest.fn(() => Promise.resolve()),
  setShortcutItems: jest.fn(),
  clearShortcutItems: jest.fn(),
  isSupported: jest.fn()
}));
