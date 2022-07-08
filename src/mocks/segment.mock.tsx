import { mockComponent } from './component.mock';

jest.mock('@segment/analytics-react-native', () => ({
  ...mockComponent('AnalyticsProvider'),
  createClient: () => jest.fn()
}));

jest.mock('@segment/sovran-react-native', () => jest.fn());
