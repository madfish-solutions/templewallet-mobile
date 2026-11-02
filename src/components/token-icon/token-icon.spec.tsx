import { act, render, waitFor } from '@testing-library/react-native';
import React, { PropsWithChildren } from 'react';
import { SWRConfig } from 'swr';

import { fetchGetTokenInfo } from 'src/apis/etherlink';
import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { SWAP_ERC20_TOKEN, SWAP_NATIVE_TOKEN, SWAP_TOKEN_ADDRESS } from 'src/utils/evm/swap.mock';
import { buildEvmSwapCatalog } from 'src/utils/evm/swap.utils';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

import { CryptoLogo } from '../crypto-logo';

import { LoadableTokenIconImage } from './loadable-image';
import { TokenIcon } from './token-icon';

jest.mock('src/apis/etherlink', () => ({ fetchGetTokenInfo: jest.fn() }));
jest.mock('../data-uri-image', () => ({ DataUriImage: jest.fn(() => null) }));
jest.mock('../crypto-logo', () => ({ CryptoLogo: jest.fn(() => null) }));
jest.mock('./loadable-image', () => ({ LoadableTokenIconImage: jest.fn(() => null) }));

const iconURL = 'https://example.com/usdc.png';
const wrapper = ({ children }: PropsWithChildren) => (
  <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
);
const imageProps = () => {
  const call = jest.mocked(LoadableTokenIconImage).mock.lastCall;
  if (!call) throw new Error('The token image did not render.');

  return call[0];
};

describe('Etherlink Swap token icons', () => {
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

  it('replaces the placeholder with an explorer icon for a catalog token without an icon', async () => {
    const [asset] = buildEvmSwapCatalog({ token: SWAP_ERC20_TOKEN }, {}, {}, {});
    render(
      <TokenIcon
        chainKind={TempleChainKind.EVM}
        chainId={asset.chainId}
        address={asset.assetSlug}
        iconURL={asset.thumbnailUri}
      />,
      { wrapper }
    );

    await waitFor(() => expect(imageProps().uri).toBe(iconURL));
    act(() => imageProps().onLoad());
    expect(imageProps().isLoading).toBe(false);
    expect(imageProps().isStackFailed).toBe(false);
  });

  it('uses a catalog logo without an explorer request', () => {
    const [asset] = buildEvmSwapCatalog({ token: { ...SWAP_ERC20_TOKEN, logoURI: iconURL } }, {}, {}, {});
    render(
      <TokenIcon
        chainKind={TempleChainKind.EVM}
        chainId={asset.chainId}
        address={asset.assetSlug}
        iconURL={asset.thumbnailUri}
      />,
      { wrapper }
    );

    expect(imageProps().uri).toBe(iconURL);
    expect(fetchGetTokenInfo).not.toHaveBeenCalled();
  });

  it('uses the built-in Etherlink logo for native XTZ', () => {
    const [asset] = buildEvmSwapCatalog({ native: SWAP_NATIVE_TOKEN }, {}, {}, {});
    render(
      <TokenIcon
        chainKind={TempleChainKind.EVM}
        chainId={ETHERLINK_MAINNET_CHAIN_ID}
        address={asset.assetSlug}
        iconName={asset.iconName}
      />,
      { wrapper }
    );

    expect(jest.mocked(CryptoLogo).mock.lastCall?.[0].name).toBe(CryptoLogoNameEnum.Etherlink);
    expect(fetchGetTokenInfo).not.toHaveBeenCalled();
  });
});
