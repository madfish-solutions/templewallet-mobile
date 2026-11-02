import { renderHook, waitFor } from '@testing-library/react-native';
import React, { PropsWithChildren } from 'react';
import { SWRConfig } from 'swr';

import { fetchGetTokenInfo } from 'src/apis/etherlink';
import { EvmTokenImagesStackParams } from 'src/hooks/use-images-stack';
import { EVM_TOKEN_SLUG } from 'src/token/interfaces/token-metadata.interface';
import { SWAP_TOKEN_ADDRESS } from 'src/utils/evm/swap.mock';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

import { useEvmTokenIconUrl } from './use-evm-token-icon-url';

jest.mock('src/apis/etherlink', () => ({ fetchGetTokenInfo: jest.fn() }));

const iconURL = 'https://example.com/usdc.png';
const params: EvmTokenImagesStackParams = { chainId: ETHERLINK_MAINNET_CHAIN_ID, address: SWAP_TOKEN_ADDRESS };
const wrapper = ({ children }: PropsWithChildren) => (
  <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
);

describe('Etherlink token icon URL', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    jest.mocked(fetchGetTokenInfo).mockResolvedValue({
      address: SWAP_TOKEN_ADDRESS,
      address_hash: SWAP_TOKEN_ADDRESS,
      decimals: '6',
      exchange_rate: null,
      icon_url: iconURL,
      name: 'USD Coin',
      symbol: 'USDC',
      type: 'ERC-20'
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it.each(['', '   '])('fetches an explorer icon for a blank URL: %s', async iconURL => {
    const { result } = renderHook(() => useEvmTokenIconUrl({ ...params, iconURL }), { wrapper });
    await waitFor(() => expect(result.current).toBe('https://example.com/usdc.png'));
  });

  it('fetches a missing token icon from the explorer', async () => {
    const { result } = renderHook(() => useEvmTokenIconUrl(params), { wrapper });
    await waitFor(() => expect(result.current).toBe(iconURL));
    expect(fetchGetTokenInfo).toHaveBeenCalledWith(SWAP_TOKEN_ADDRESS, expect.any(AbortSignal));
  });

  it('shares the explorer request between multiple token rows', async () => {
    const { result } = renderHook(() => [useEvmTokenIconUrl(params), useEvmTokenIconUrl(params)], { wrapper });
    await waitFor(() => expect(result.current).toEqual([iconURL, iconURL]));
    expect(fetchGetTokenInfo).toHaveBeenCalledTimes(1);
  });

  it.each([
    { ...params, iconURL },
    { ...params, address: EVM_TOKEN_SLUG },
    { ...params, isCollectible: true },
    { ...params, chainId: 1 }
  ])('skips the explorer for an existing icon, native token, collectible, or other chain', props => {
    const { result } = renderHook(() => useEvmTokenIconUrl(props), { wrapper });
    expect(result.current).toBe(props.iconURL);
    expect(fetchGetTokenInfo).not.toHaveBeenCalled();
  });

  it('keeps the placeholder if the explorer request fails', async () => {
    jest.mocked(fetchGetTokenInfo).mockRejectedValue(new Error('Explorer unavailable'));
    const { result } = renderHook(() => useEvmTokenIconUrl(params), { wrapper });
    await waitFor(() => expect(fetchGetTokenInfo).toHaveBeenCalledTimes(1));
    expect(result.current).toBeUndefined();
  });
});
