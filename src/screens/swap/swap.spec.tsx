import { act, render } from '@testing-library/react-native';
import React from 'react';

import { TextSegmentControl } from 'src/components/segmented-control/text-segment-control/text-segment-control';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useFilteredSwapTokensList } from 'src/hooks/use-filtered-swap-tokens.hook';
import { useSendAssets } from 'src/modals/send-modal/hooks/use-send-assets';
import { ScreensEnum, ScreensParamList } from 'src/navigator/enums/screens.enum';
import { useScreenParams } from 'src/navigator/hooks/use-navigation.hook';
import {
  useAccountAddressForEvm,
  useAccountAddressForTezos,
  useCurrentAccountId
} from 'src/store/wallet/wallet-selectors';
import { EvmAssetStandardEnum, EVM_TOKEN_SLUG } from 'src/token/interfaces/token-metadata.interface';
import { emptyTezosLikeToken } from 'src/token/interfaces/token.interface';
import { toTezosSendAsset } from 'src/utils/assets/tezos-send-asset.mapper';
import { SWAP_NATIVE_ASSET } from 'src/utils/evm/swap.mock';

import { useSwapAssets } from './components/swap-assets-context';
import { EvmSwapForm } from './evm-swap-form/evm-swap-form';
import { useEvmSwapCatalog } from './evm-swap-form/use-evm-swap-catalog';
import { SwapScreen } from './swap';
import { TezosSwapForm } from './tezos-swap-form/tezos-swap-form';

jest.mock('./evm-swap-form/evm-swap-form', () => ({ EvmSwapForm: jest.fn(() => null) }));
jest.mock('./evm-swap-form/use-evm-swap-catalog', () => ({ useEvmSwapCatalog: jest.fn() }));
jest.mock('./tezos-swap-form/tezos-swap-form', () => ({ TezosSwapForm: jest.fn(() => null) }));
jest.mock('src/hooks/use-filtered-swap-tokens.hook', () => ({
  TokensInputsEnum: { From: 'From' },
  useFilteredSwapTokensList: jest.fn()
}));
jest.mock('src/modals/send-modal/hooks/use-send-assets', () => ({ useSendAssets: jest.fn() }));
jest.mock('src/navigator/hooks/use-navigation.hook', () => ({ useScreenParams: jest.fn() }));
jest.mock('src/store/wallet/wallet-selectors', () => ({
  useCurrentAccountId: jest.fn(),
  useAccountAddressForEvm: jest.fn(),
  useAccountAddressForTezos: jest.fn()
}));
jest.mock('src/utils/analytics/use-analytics.hook', () => ({ usePageAnalytic: jest.fn() }));
jest.mock('src/components/segmented-control/text-segment-control/text-segment-control', () => ({
  TextSegmentControl: jest.fn(() => null)
}));

let params: ScreensParamList[ScreensEnum.SwapScreen];
let context: ReturnType<typeof useSwapAssets>;
const tezosAsset = toTezosSendAsset({ ...emptyTezosLikeToken, address: 'KT1token', symbol: 'TOKEN' });

const FormProbe = () => {
  context = useSwapAssets();

  return null;
};

describe('unified swap screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    params = undefined;
    jest.mocked(useScreenParams).mockImplementation(() => params);
    jest.mocked(useCurrentAccountId).mockReturnValue('account');
    jest.mocked(useAccountAddressForTezos).mockReturnValue('tz1account');
    jest.mocked(useAccountAddressForEvm).mockReturnValue('0x0000000000000000000000000000000000000001');
    jest.mocked(useFilteredSwapTokensList).mockReturnValue({
      filteredTokensList: [tezosAsset],
      searchValue: undefined,
      setSearchValue: jest.fn()
    });
    jest.mocked(useEvmSwapCatalog).mockReturnValue([SWAP_NATIVE_ASSET]);
    jest
      .mocked(useSendAssets)
      .mockReturnValue([
        tezosAsset,
        { ...SWAP_NATIVE_ASSET, assetSlug: EVM_TOKEN_SLUG, sendStandard: EvmAssetStandardEnum.NATIVE }
      ]);
    jest.mocked(TezosSwapForm).mockImplementation(FormProbe);
    jest.mocked(EvmSwapForm).mockImplementation(FormProbe);
  });

  it('uses Tezos by default and exposes both networks without tabs', () => {
    render(<SwapScreen />);
    expect(TezosSwapForm).toHaveBeenCalled();
    expect(EvmSwapForm).not.toHaveBeenCalled();
    expect(TextSegmentControl).not.toHaveBeenCalled();
    expect(context.inputAssets).toEqual([tezosAsset, SWAP_NATIVE_ASSET]);
  });

  it('opens Etherlink for an EVM-only account and excludes Tezos tokens', () => {
    jest.mocked(useAccountAddressForTezos).mockReturnValue(undefined);
    render(<SwapScreen />);
    expect(EvmSwapForm).toHaveBeenCalled();
    expect(TezosSwapForm).not.toHaveBeenCalled();
    expect(context.inputAssets).toEqual([SWAP_NATIVE_ASSET]);
  });

  it('excludes Etherlink tokens for a Tezos-only account', () => {
    jest.mocked(useAccountAddressForEvm).mockReturnValue(undefined);
    render(<SwapScreen />);
    expect(context.inputAssets).toEqual([tezosAsset]);
  });

  it('excludes catalog tokens outside the Send asset list', () => {
    jest.mocked(useSendAssets).mockReturnValue([tezosAsset]);
    render(<SwapScreen />);
    expect(context.inputAssets).toEqual([tezosAsset]);
  });

  it('preserves the market Tezos output parameter', () => {
    params = { outputToken: emptyTezosLikeToken };
    render(<SwapScreen />);
    expect(jest.mocked(TezosSwapForm).mock.calls[0][0]).toMatchObject({ outputToken: emptyTezosLikeToken });
  });

  it('changes the technical form through input selection and clears the previous output', () => {
    params = { outputToken: emptyTezosLikeToken };
    render(<SwapScreen />);
    act(() => context.onSelectInput(SWAP_NATIVE_ASSET));
    expect(jest.mocked(EvmSwapForm).mock.lastCall?.[0]).toEqual({
      inputAsset: { chainKind: TempleChainKind.EVM, chainId: 42793, slug: SWAP_NATIVE_ASSET.assetSlug },
      outputAsset: undefined
    });
    act(() => context.onSelectInput(tezosAsset));
    expect(jest.mocked(TezosSwapForm).mock.lastCall?.[0]).toEqual({ inputToken: tezosAsset, outputToken: undefined });
  });

  it('applies a new route parameter after an input network change', () => {
    const { rerender } = render(<SwapScreen />);
    act(() => context.onSelectInput(SWAP_NATIVE_ASSET));
    params = { outputToken: tezosAsset };
    rerender(<SwapScreen />);
    expect(jest.mocked(TezosSwapForm).mock.lastCall?.[0]).toMatchObject({ outputToken: tezosAsset });
  });

  it('resets the technical form when the account changes', () => {
    const { rerender } = render(<SwapScreen />);
    act(() => context.onSelectInput(SWAP_NATIVE_ASSET));
    jest.mocked(useCurrentAccountId).mockReturnValue('another-account');
    rerender(<SwapScreen />);
    expect(jest.mocked(TezosSwapForm).mock.lastCall?.[0]).toEqual({ inputToken: undefined, outputToken: undefined });
  });

  it('rejects a different EVM chain at the screen boundary', () => {
    params = { chainKind: TempleChainKind.EVM, chainId: 1 };
    render(<SwapScreen />);
    expect(EvmSwapForm).not.toHaveBeenCalled();
    expect(TezosSwapForm).not.toHaveBeenCalled();
  });
});
