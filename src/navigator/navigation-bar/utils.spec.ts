import { renderHook } from '@testing-library/react-native';

import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { emptyTezosLikeToken } from 'src/token/interfaces/token.interface';
import { useTezosAccountTokens } from 'src/utils/assets/hooks';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

import { ScreensEnum } from '../enums/screens.enum';
import { useNavigationState } from '../hooks/use-navigation.hook';

import { useSwapScreenParams } from './utils';

jest.mock('src/utils/assets/hooks', () => ({ useTezosAccountTokens: jest.fn() }));
jest.mock('../hooks/use-navigation.hook', () => ({ useNavigationState: jest.fn() }));

const mockTezosToken = { ...emptyTezosLikeToken, symbol: 'TEZ', name: 'Tezos' };

const routesFor = (chainKind: TempleChainKind, chainId: number | string, slug: string) => [
  { name: ScreensEnum.TokenScreen, params: { descriptor: { chainKind, chainId, slug } } }
];

describe('swap navigation parameters', () => {
  it('retains the Etherlink descriptor from the token screen', () => {
    const descriptor = { chainKind: TempleChainKind.EVM, chainId: ETHERLINK_MAINNET_CHAIN_ID, slug: 'eth' };
    jest
      .mocked(useNavigationState)
      .mockReturnValue(routesFor(descriptor.chainKind, descriptor.chainId, descriptor.slug));
    jest.mocked(useTezosAccountTokens).mockReturnValue([]);
    const { result } = renderHook(() => useSwapScreenParams(ScreensEnum.TokenScreen));
    expect(result.current).toEqual({
      chainKind: TempleChainKind.EVM,
      chainId: ETHERLINK_MAINNET_CHAIN_ID,
      inputAsset: descriptor
    });
  });

  it('does not route other EVM chains into Etherlink', () => {
    jest.mocked(useNavigationState).mockReturnValue(routesFor(TempleChainKind.EVM, 1, 'eth'));
    const { result } = renderHook(() => useSwapScreenParams(ScreensEnum.TokenScreen));
    expect(result.current).toBeUndefined();
  });

  it('preserves the Tezos token parameter and leaves market navigation unchanged', () => {
    jest.mocked(useNavigationState).mockReturnValue(routesFor(TempleChainKind.Tezos, 'mainnet', 'tez'));
    jest.mocked(useTezosAccountTokens).mockReturnValue([mockTezosToken]);
    const { result } = renderHook(() => useSwapScreenParams(ScreensEnum.TokenScreen));
    expect(result.current).toEqual({ inputToken: mockTezosToken });
    const market = renderHook(() => useSwapScreenParams(ScreensEnum.Market));
    expect(market.result.current).toBeUndefined();
  });
});
