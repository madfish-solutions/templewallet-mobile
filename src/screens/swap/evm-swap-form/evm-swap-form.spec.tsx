import { act, render } from '@testing-library/react-native';
import { BigNumber } from 'bignumber.js';
import React from 'react';

import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { EvmSwapAsset, EvmSwapAssetDescriptor } from 'src/types/evm-swap';
import { SWAP_ERC20_ASSET, SWAP_NATIVE_ASSET } from 'src/utils/evm/swap.mock';

import { SwapAssetAmountInput } from '../components/swap-asset-amount-input';
import { SwapDirectionButton } from '../components/swap-direction-button';

import { EvmSwapForm } from './evm-swap-form';
import { useEvmSwapCatalog } from './use-evm-swap-catalog';

jest.mock('src/store', () => ({ dispatch: jest.fn() }));
jest.mock('src/navigator/hooks/use-navigation.hook', () => ({ useNavigateToModal: () => jest.fn() }));
jest.mock('../components/swap-asset-amount-input', () => ({ SwapAssetAmountInput: jest.fn(() => null) }));
jest.mock('../components/swap-direction-button', () => ({ SwapDirectionButton: jest.fn(() => null) }));
jest.mock('./evm-swap-details', () => ({ EvmSwapDetails: jest.fn(() => null) }));
jest.mock('./use-evm-swap-catalog', () => ({ useEvmSwapCatalog: jest.fn() }));
jest.mock('./use-evm-swap-quote', () => ({
  useEvmSwapQuote: () => ({ invalidate: mockInvalidate, isLoading: false })
}));
jest.mock('src/hooks/evm/use-evm-transaction-fee', () => ({ useEvmTransactionFee: () => ({}) }));
jest.mock('src/hooks/evm/use-evm-chains.hook', () => ({ useEvmChain: () => ({ disabled: false }) }));
jest.mock('src/store/swap/swap-selectors', () => ({ useEvmSwapTokensSelector: () => ({ isLoading: false }) }));
jest.mock('src/components/screen-container/screen-container', () => ({
  ScreenContainer: ({ children }: React.PropsWithChildren) => children
}));
jest.mock('src/components/button/buttons-floating-container/buttons-floating-container', () => ({
  ButtonsFloatingContainer: ({ children }: React.PropsWithChildren) => children
}));
jest.mock('src/components/button/button-large/button-large-primary/button-large-primary', () => ({
  ButtonLargePrimary: jest.fn(() => null)
}));

const mockInvalidate = jest.fn();

const descriptor = (asset: EvmSwapAsset): EvmSwapAssetDescriptor => ({
  chainKind: TempleChainKind.EVM,
  chainId: asset.chainId,
  slug: asset.assetSlug
});
const inputProps = (field: 'input' | 'output') => {
  const call = jest
    .mocked(SwapAssetAmountInput)
    .mock.calls.filter(([props]) => props.field === field)
    .pop();
  if (!call) throw new Error('The field did not render.');

  return call[0];
};
const reverse = (): void => {
  const call = jest.mocked(SwapDirectionButton).mock.lastCall;
  if (!call) throw new Error('The reverse button did not render.');
  call[0].onPress();
};

describe('Etherlink swap token selection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useEvmSwapCatalog).mockReturnValue([SWAP_NATIVE_ASSET, SWAP_ERC20_ASSET]);
  });

  it('shows an empty output selector until the user selects a token', () => {
    render(<EvmSwapForm />);
    expect(inputProps('input').value.asset.assetSlug).toBe(SWAP_NATIVE_ASSET.assetSlug);
    expect(inputProps('output').value.asset.symbol).toBe('');
    expect(inputProps('output').assetsList).toContainEqual(SWAP_ERC20_ASSET);
  });

  it('clears the output when the input selects that token', async () => {
    render(<EvmSwapForm outputAsset={descriptor(SWAP_ERC20_ASSET)} />);
    await act(async () => inputProps('input').onValueChange({ asset: SWAP_ERC20_ASSET, amount: new BigNumber(1) }));
    expect(inputProps('input').value.asset).toBe(SWAP_ERC20_ASSET);
    expect(inputProps('output').assetsList).toEqual([SWAP_NATIVE_ASSET]);
    expect(inputProps('input').value.amount).toBeUndefined();
    expect(inputProps('output').value.asset.symbol).toBe('');
  });

  it('excludes the input token from output options and rejects a stale selection', async () => {
    render(<EvmSwapForm />);
    expect(inputProps('output').assetsList).not.toContainEqual(SWAP_NATIVE_ASSET);
    await act(async () => inputProps('output').onValueChange({ asset: SWAP_NATIVE_ASSET }));
    expect(inputProps('input').value.asset).toBe(SWAP_NATIVE_ASSET);
    expect(inputProps('output').value.asset.symbol).toBe('');
  });

  it('reverses a partial pair and keeps both selectors available', async () => {
    render(<EvmSwapForm />);
    await act(async () => reverse());
    expect(inputProps('input').value.asset.symbol).toBe('');
    expect(inputProps('output').value.asset).toBe(SWAP_NATIVE_ASSET);
    await act(async () => inputProps('input').onValueChange({ asset: SWAP_ERC20_ASSET }));
    expect(inputProps('input').value.asset).toBe(SWAP_ERC20_ASSET);
  });

  it('preserves an amount update and clears the amount after reversal', async () => {
    render(<EvmSwapForm outputAsset={descriptor(SWAP_ERC20_ASSET)} />);
    const amount = new BigNumber(100);
    await act(async () => inputProps('input').onValueChange({ asset: SWAP_NATIVE_ASSET, amount }));
    expect(inputProps('input').value.amount).toEqual(amount);
    await act(async () => reverse());
    expect(inputProps('input').value.asset).toBe(SWAP_ERC20_ASSET);
    expect(inputProps('output').value.asset).toBe(SWAP_NATIVE_ASSET);
    expect(inputProps('input').value.amount).toBeUndefined();
  });
});
