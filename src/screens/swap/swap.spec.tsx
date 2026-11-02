import { act, render } from '@testing-library/react-native';
import React from 'react';

import { TextSegmentControl } from 'src/components/segmented-control/text-segment-control/text-segment-control';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { ScreensEnum, ScreensParamList } from 'src/navigator/enums/screens.enum';
import { useNavigateToScreen, useScreenParams } from 'src/navigator/hooks/use-navigation.hook';
import {
  useAccountAddressForEvm,
  useAccountAddressForTezos,
  useCurrentAccountId
} from 'src/store/wallet/wallet-selectors';
import { emptyTezosLikeToken } from 'src/token/interfaces/token.interface';

import { EvmSwapForm } from './evm-swap-form/evm-swap-form';
import { SwapScreen } from './swap';
import { SwapForm } from './swap-form/swap-form';

jest.mock('./evm-swap-form/evm-swap-form', () => ({ EvmSwapForm: jest.fn(() => null) }));
jest.mock('./swap-form/swap-form', () => ({ SwapForm: jest.fn(() => null) }));
jest.mock('src/navigator/hooks/use-navigation.hook', () => ({
  useScreenParams: jest.fn(),
  useNavigateToScreen: jest.fn()
}));
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
const navigate = jest.fn();

describe('swap screen chain boundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    params = undefined;
    jest.mocked(useScreenParams).mockImplementation(() => params);
    jest.mocked(useNavigateToScreen).mockReturnValue(navigate);
    jest.mocked(useCurrentAccountId).mockReturnValue('account');
    jest.mocked(useAccountAddressForTezos).mockReturnValue('tz1account');
    jest.mocked(useAccountAddressForEvm).mockReturnValue('0x0000000000000000000000000000000000000001');
  });

  it('keeps Tezos as the default for dual-chain accounts', () => {
    render(<SwapScreen />);
    expect(SwapForm).toHaveBeenCalled();
    expect(EvmSwapForm).not.toHaveBeenCalled();
  });

  it('opens Etherlink for an EVM-only account without Tezos hooks in the form', () => {
    jest.mocked(useAccountAddressForTezos).mockReturnValue(undefined);
    render(<SwapScreen />);
    expect(EvmSwapForm).toHaveBeenCalled();
    expect(SwapForm).not.toHaveBeenCalled();
  });

  it('preserves the market Tezos output parameter', () => {
    params = { outputToken: emptyTezosLikeToken };
    render(<SwapScreen />);
    expect(jest.mocked(SwapForm).mock.calls[0][0]).toMatchObject({ outputToken: emptyTezosLikeToken });
  });

  it('sets an explicit Etherlink network and resets the pair on network choice', () => {
    render(<SwapScreen />);
    const control = jest.mocked(TextSegmentControl).mock.calls[0][0];
    act(() => control.onChange(1));
    expect(navigate).toHaveBeenCalledWith({
      screen: ScreensEnum.SwapScreen,
      params: { chainKind: TempleChainKind.EVM, chainId: 42793 }
    });
  });

  it('rejects a different EVM chain at the screen boundary', () => {
    params = { chainKind: TempleChainKind.EVM, chainId: 1 };
    render(<SwapScreen />);
    expect(EvmSwapForm).not.toHaveBeenCalled();
    expect(SwapForm).not.toHaveBeenCalled();
  });
});
