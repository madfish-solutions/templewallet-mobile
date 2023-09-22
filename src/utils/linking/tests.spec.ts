import { mockLinking } from '../../mocks/react-native.mock';
import { DCP_RPC } from '../rpc/rpc-list';
import { openUrl, tzktUrl } from './index';

describe('tzktUrl', () => {
  it('should return tzkt link with passed non-empty address path', () => {
    expect(tzktUrl('https://mainnet-node.madfish.solutions', 'test')).toEqual('https://tzkt.io/test');
  });

  it('should return tzkt link with passed empty address path', () => {
    expect(tzktUrl('https://mainnet-node.madfish.solutions', '')).toEqual('https://tzkt.io/');
  });

  it('should return DPC tzkt link with passed non-empty address path (DPC rpcUrl)', () => {
    expect(tzktUrl(DCP_RPC.url, 'test')).toEqual('https://explorer.tlnt.net/test');
  });

  it('should return DPC tzkt link with passed empty address path (DPC rpcUrl)', () => {
    expect(tzktUrl(DCP_RPC.url, '')).toEqual('https://explorer.tlnt.net/');
  });
});

describe('openUrl', () => {
  jest.useFakeTimers();
  afterAll(() => void jest.useRealTimers());

  beforeEach(() => {
    mockLinking.openURL.mockReset();
  });

  it('should open valid link', async () => {
    const mockValidUrl = 'https://tzkt.io/';

    openUrl(mockValidUrl);

    await jest.runAllTimersAsync();

    expect(mockLinking.openURL).toHaveBeenCalledWith(mockValidUrl);
  });

  it('should not open invalid link', async () => {
    mockLinking.canOpenURL.mockReturnValue(Promise.reject());
    openUrl('invalid_link');

    await jest.runAllTimersAsync();

    expect(mockLinking.openURL).not.toHaveBeenCalled();
  });
});
