jest.mock('@segment/analytics-react-native', () => ({
  AnalyticsProvider: () => jest.fn(),
  createClient: () => jest.fn()
}));

jest.mock('@segment/sovran-react-native', () => jest.fn());
