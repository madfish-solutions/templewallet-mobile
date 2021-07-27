jest.mock('react-native-quick-actions', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const QuickActions = require('react-native-quick-actions');

  QuickActions.popInitialAction = jest.fn(() => Promise.resolve());
  QuickActions.setShortcutItems = jest.fn();
  QuickActions.clearShortcutItems = jest.fn();
  QuickActions.isSupported = jest.fn();
});
