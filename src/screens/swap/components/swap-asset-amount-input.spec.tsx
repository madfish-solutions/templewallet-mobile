import { act, render } from '@testing-library/react-native';
import { BigNumber } from 'bignumber.js';
import React from 'react';

import { AssetAmountInputV2 } from 'src/components/asset-amount-input/asset-amount-input';
import { AssetNetworkFilter } from 'src/components/asset-network-filter/asset-network-filter';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { AssetInterface } from 'src/interfaces/asset.interface';
import { emptyTezosLikeToken } from 'src/token/interfaces/token.interface';
import { toTezosSendAsset } from 'src/utils/assets/tezos-send-asset.mapper';
import { SWAP_ERC20_ASSET, SWAP_NATIVE_ASSET } from 'src/utils/evm/swap.mock';

import { SwapAssetAmountInput } from './swap-asset-amount-input';
import { SwapAssetsContext } from './swap-assets-context';

jest.mock('src/components/asset-amount-input/asset-amount-input', () => ({ AssetAmountInputV2: jest.fn(() => null) }));
jest.mock('src/components/asset-network-filter/asset-network-filter', () => ({
  AssetNetworkFilter: jest.fn(() => null)
}));
jest.mock('../swap-form/swap-form.styles', () => ({ useSwapFormStyles: () => ({}) }));

const tezosAsset = toTezosSendAsset({
  ...emptyTezosLikeToken,
  address: 'KT1token',
  name: 'Tezos Token',
  symbol: 'TOKEN',
  balance: '1000000'
});
const onSelectInput = jest.fn();
const onValueChange = jest.fn();
const catalog = [tezosAsset, SWAP_NATIVE_ASSET, SWAP_ERC20_ASSET];
const inputProps = () => {
  const call = jest.mocked(AssetAmountInputV2).mock.lastCall;
  if (!call) throw new Error('The input did not render.');

  return call[0];
};
const filterProps = () => {
  const call = jest.mocked(AssetNetworkFilter).mock.lastCall;
  if (!call) throw new Error('The filter did not render.');

  return call[0];
};

const renderInput = (field: 'input' | 'output', asset: AssetInterface, assetsList: AssetInterface[]) =>
  render(
    <SwapAssetsContext.Provider value={{ inputAssets: catalog, onSelectInput }}>
      <SwapAssetAmountInput
        field={field}
        value={{ asset }}
        assetsList={assetsList}
        onValueChange={onValueChange}
        label="Token"
      />
    </SwapAssetsContext.Provider>
  );

describe('swap token selector', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shows both networks and reuses the Send network filters', () => {
    renderInput('input', tezosAsset, [tezosAsset]);
    expect(inputProps().assetsList).toHaveLength(3);
    const header = inputProps().dropdownListHeader;
    const { rerender } = render(<>{header}</>);
    act(() => filterProps().onChange(TempleChainKind.EVM));
    expect(inputProps().assetsList).toEqual(expect.arrayContaining([SWAP_NATIVE_ASSET, SWAP_ERC20_ASSET]));
    expect(inputProps().assetsList).toHaveLength(2);
    rerender(<>{inputProps().dropdownListHeader}</>);
    act(() => filterProps().onChange('all'));
    expect(inputProps().assetsList).toHaveLength(3);
  });

  it('searches across both networks by name and contract address', () => {
    renderInput('input', tezosAsset, [tezosAsset]);
    act(() => inputProps().setSearchValue?.('  USD coin  '));
    expect(inputProps().assetsList).toEqual([SWAP_ERC20_ASSET]);
    act(() => inputProps().setSearchValue?.('KT1TOKEN'));
    expect(inputProps().assetsList).toEqual([tezosAsset]);
    act(() => inputProps().setSearchValue?.(''));
    expect(inputProps().assetsList).toHaveLength(3);
  });

  it('routes another network input to the screen without a local form update', () => {
    renderInput('input', tezosAsset, [tezosAsset]);
    act(() => inputProps().onValueChange({ asset: SWAP_NATIVE_ASSET, amount: new BigNumber(1) }));
    expect(onSelectInput).toHaveBeenCalledWith(SWAP_NATIVE_ASSET);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('keeps local amount updates within the technical form', () => {
    renderInput('input', tezosAsset, [tezosAsset]);
    const value = { asset: tezosAsset, amount: new BigNumber(100) };
    act(() => inputProps().onValueChange(value));
    expect(onValueChange).toHaveBeenCalledWith(value);
    expect(onSelectInput).not.toHaveBeenCalled();
  });

  it.each([
    { asset: tezosAsset, assets: [tezosAsset] },
    { asset: SWAP_NATIVE_ASSET, assets: [SWAP_NATIVE_ASSET, SWAP_ERC20_ASSET] }
  ])('restricts output assets to the input network', ({ asset, assets }) => {
    renderInput('output', asset, assets);
    expect(inputProps().assetsList).toHaveLength(assets.length);
    expect(inputProps().assetsList.every(item => item.chainKind === asset.chainKind)).toBe(true);
    expect(inputProps().dropdownListHeader).toBeUndefined();
  });

  it('uses the catalog identity and balance for a legacy Tezos value', () => {
    const legacyAsset = { ...emptyTezosLikeToken, address: tezosAsset.address, chainKind: TempleChainKind.Tezos };
    renderInput('input', legacyAsset, [tezosAsset]);
    expect(inputProps().value.asset).toEqual(tezosAsset);
  });

  it.each([TempleChainKind.Tezos, TempleChainKind.EVM])('keeps the default output empty on %s', chainKind => {
    renderInput(
      'output',
      { ...emptyTezosLikeToken, chainKind },
      chainKind === TempleChainKind.EVM ? [SWAP_NATIVE_ASSET] : [tezosAsset]
    );
    expect(inputProps().value.asset.symbol).toBe('');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('keeps an empty output selectable', () => {
    renderInput('output', { ...emptyTezosLikeToken, chainKind: TempleChainKind.EVM }, [SWAP_NATIVE_ASSET]);
    act(() => inputProps().onValueChange({ asset: SWAP_NATIVE_ASSET }));
    expect(onValueChange).toHaveBeenCalledWith({ asset: SWAP_NATIVE_ASSET });
  });
});
