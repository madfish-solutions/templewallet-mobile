import { act, render } from '@testing-library/react-native';
import { BigNumber } from 'bignumber.js';
import React from 'react';

import { AssetAmountInputV2 } from 'src/components/asset-amount-input/asset-amount-input';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { EvmSwapAsset, EvmSwapAssetDescriptor, EvmSwapQuote } from 'src/types/evm-swap';
import { SWAP_ERC20_ASSET, SWAP_NATIVE_ASSET, SWAP_QUOTE } from 'src/utils/evm/swap.mock';

import { SwapDirectionButton } from '../components/swap-direction-button';
import { SwapFormSelectors } from '../swap-form/swap-form.selectors';

import { EvmSwapForm } from './evm-swap-form';
import { useEvmSwapCatalog } from './use-evm-swap-catalog';

jest.mock('src/store', () => ({ dispatch: jest.fn() }));
jest.mock('src/navigator/hooks/use-navigation.hook', () => ({ useNavigateToModal: () => jest.fn() }));
jest.mock('src/components/asset-amount-input/asset-amount-input', () => ({ AssetAmountInputV2: jest.fn(() => null) }));
jest.mock('../components/swap-direction-button', () => ({ SwapDirectionButton: jest.fn(() => null) }));
jest.mock('./use-evm-swap-catalog', () => ({ useEvmSwapCatalog: jest.fn() }));
jest.mock('./use-evm-swap-quote', () => ({
  useEvmSwapQuote: () => ({ invalidate: mockInvalidate, isLoading: false, quote: mockQuote })
}));
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
let mockQuote: EvmSwapQuote | undefined;

const descriptor = (asset: EvmSwapAsset): EvmSwapAssetDescriptor => ({
  chainKind: TempleChainKind.EVM,
  chainId: asset.chainId,
  slug: asset.assetSlug
});
const inputProps = (field: 'input' | 'output') => {
  const call = jest
    .mocked(AssetAmountInputV2)
    .mock.calls.filter(
      ([props]) =>
        props.testID ===
        (field === 'input' ? SwapFormSelectors.fromAssetAmountInput : SwapFormSelectors.toAssetAmountInput)
    )
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
    mockQuote = undefined;
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

  it.each([SWAP_NATIVE_ASSET, SWAP_ERC20_ASSET])(
    'uses the full $symbol balance for MAX before an amount or quote',
    asset => {
      render(<EvmSwapForm inputAsset={descriptor(asset)} />);
      expect(inputProps('input').maxAmount).toBe(asset.balance);
      expect(inputProps('input').maxButtonDisabled).toBe(false);
      expect(inputProps('input').value.amount).toBeUndefined();
    }
  );

  it('updates MAX after a balance update', () => {
    const { rerender } = render(<EvmSwapForm />);
    const updatedAsset = { ...SWAP_NATIVE_ASSET, balance: '123456789' };
    jest.mocked(useEvmSwapCatalog).mockReturnValue([updatedAsset, SWAP_ERC20_ASSET]);
    rerender(<EvmSwapForm />);
    expect(inputProps('input').maxAmount).toBe(updatedAsset.balance);
    expect(inputProps('input').value.asset.balance).toBe(updatedAsset.balance);
  });

  it('resolves the selected assets after the catalog arrives', () => {
    jest.mocked(useEvmSwapCatalog).mockReturnValue([]);
    const { rerender } = render(<EvmSwapForm outputAsset={descriptor(SWAP_ERC20_ASSET)} />);
    expect(inputProps('input').maxButtonDisabled).toBe(true);
    jest.mocked(useEvmSwapCatalog).mockReturnValue([SWAP_NATIVE_ASSET, SWAP_ERC20_ASSET]);
    rerender(<EvmSwapForm outputAsset={descriptor(SWAP_ERC20_ASSET)} />);
    expect(inputProps('input').value.asset).toEqual(SWAP_NATIVE_ASSET);
    expect(inputProps('output').value.asset).toEqual(SWAP_ERC20_ASSET);
    expect(inputProps('input').maxButtonDisabled).toBe(false);
  });

  it('uses the shared details with the quoted minimum and no Tezos cashback', () => {
    mockQuote = SWAP_QUOTE;
    const screen = render(<EvmSwapForm outputAsset={descriptor(SWAP_ERC20_ASSET)} />);
    expect(screen.getByText('Routing Fee')).toBeTruthy();
    expect(screen.getByText('1 USDC = 1 XTZ')).toBeTruthy();
    expect(screen.getByText('0.997500 USDC')).toBeTruthy();
    expect(screen.queryByText('Cashback')).toBeNull();
    expect(inputProps('output').value.amount).toEqual(new BigNumber(SWAP_QUOTE.route.toAmount));
  });
});
