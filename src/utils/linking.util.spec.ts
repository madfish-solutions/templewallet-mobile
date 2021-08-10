import { mockLinking } from '../mocks/react-native.mock';
import { openUrl, tzktUrl } from './linking.util';

describe('tzktUrl', () => {
  it('should return tzkt link with passed non-empty address path', () => {
    expect(tzktUrl('test')).toEqual('https://tzkt.io/test');
  });

  it('should return tzkt link with passed empty address path', () => {
    expect(tzktUrl('')).toEqual('https://tzkt.io/');
  });
});

describe('openUrl', () => {
  beforeEach(() => {
    mockLinking.openURL.mockReset();
  });

  it('should open valid link', () => {
    const mockValidUrl = 'https://tzkt.io/';

    openUrl(mockValidUrl);

    jest.runAllTimers();
    expect(mockLinking.openURL).toHaveBeenCalledWith(mockValidUrl);
  });

  it('should not open invalid link', () => {
    mockLinking.canOpenURL.mockReturnValue(Promise.reject());
    openUrl('invalid_link');

    jest.runAllTimers();
    expect(mockLinking.openURL).not.toHaveBeenCalled();
  });
});
