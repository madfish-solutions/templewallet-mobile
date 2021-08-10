export const mockReactNativeQuickActions = {
  setShortcutItems: jest.fn(),
  clearShortcutItems: jest.fn(),
  popInitialAction: jest.fn(() => Promise.resolve()),
  isSupported: jest.fn()
};

jest.mock('react-native-quick-actions', () => mockReactNativeQuickActions);
