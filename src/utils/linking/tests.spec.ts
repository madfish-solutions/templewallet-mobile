import { openUrl, tzktUrl } from '.';
import { mockLinking } from '../../mocks/react-native.mock';
import { DCP_RPC } from '../rpc/rpc-list';

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
