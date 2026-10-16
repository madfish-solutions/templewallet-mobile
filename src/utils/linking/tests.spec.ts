import { mockLinking } from '../../mocks/react-native.mock';

import { openUrl, tzktUrl } from './index';

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
    mockLinking.openURL.mockReset().mockResolvedValue(undefined);
    mockLinking.canOpenURL.mockReset().mockResolvedValue(true);
  });

  it('opens an HTTP URL without a capability check', async () => {
    const mockValidUrl = 'https://tzkt.io/';

    await openUrl(mockValidUrl);

    expect(mockLinking.openURL).toHaveBeenCalledWith(mockValidUrl);
    expect(mockLinking.canOpenURL).not.toHaveBeenCalled();
  });

  it('opens a supported custom URL', async () => {
    const url = 'tezos://test';

    await openUrl(url);

    expect(mockLinking.canOpenURL).toHaveBeenCalledWith(url);
    expect(mockLinking.openURL).toHaveBeenCalledWith(url);
  });

  it('rejects an unsupported URL when the caller requests errors', async () => {
    mockLinking.canOpenURL.mockResolvedValueOnce(false);

    await expect(openUrl('invalid_link', { rethrowError: true })).rejects.toThrow('Cannot open URL: invalid_link');

    expect(mockLinking.openURL).not.toHaveBeenCalled();
  });

  it('reports a capability check error', async () => {
    const error = new Error('Capability check failed');
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    mockLinking.canOpenURL.mockRejectedValueOnce(error);

    try {
      await expect(openUrl('invalid_link')).resolves.toBeUndefined();

      expect(mockLinking.openURL).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });

  it('rejects an open error when the caller requests errors', async () => {
    const error = new Error('Open URL failed');
    mockLinking.openURL.mockRejectedValueOnce(error);

    await expect(openUrl('https://tzkt.io/', { rethrowError: true })).rejects.toBe(error);
  });
});
