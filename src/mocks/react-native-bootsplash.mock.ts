export {};

jest.mock('react-native-bootsplash', () => {
  return {
    hide: jest.fn().mockResolvedValue(void 0),
    isVisible: jest.fn().mockResolvedValue(false),
    useHideAnimation: jest.fn().mockReturnValue({
      container: {},
      logo: { source: 0 },
      brand: { source: 0 }
    })
  };
});
