import React, { useMemo } from 'react';

import { AssetAmountInputV2, AssetAmountInterface } from 'src/components/asset-amount-input/asset-amount-input';
import { AssetAmountInputProps } from 'src/components/asset-amount-input/asset-amount-input.props';
import { AssetNetworkFilter } from 'src/components/asset-network-filter/asset-network-filter';
import { useAssetSelection } from 'src/hooks/use-asset-selection';
import { AssetInterface } from 'src/interfaces/asset.interface';
import { useAccountAddressForEvm, useAccountAddressForTezos } from 'src/store/wallet/wallet-selectors';
import { assetsEqualityFn, getAssetKey, getAssetSlug } from 'src/utils/asset.utils';
import { sortAssetsByValue } from 'src/utils/assets/sort-assets';

import { useSwapFormStyles } from '../swap-form/swap-form.styles';

import { useSwapAssets } from './swap-assets-context';

interface Props<TAsset extends AssetInterface> extends AssetAmountInputProps<TAsset> {
  field: 'input' | 'output';
}

const SwapAssetAmountInput = <TAsset extends AssetInterface>({
  field,
  assetsList,
  value,
  onValueChange,
  ...props
}: Props<TAsset>) => {
  const styles = useSwapFormStyles();
  const tezosAddress = useAccountAddressForTezos();
  const evmAddress = useAccountAddressForEvm();
  const { inputAssets, onSelectInput } = useSwapAssets();
  const assets = useMemo(() => {
    if (field === 'output') return sortAssetsByValue(assetsList);
    const selected = assetsList.find(asset => getAssetSlug(asset) === getAssetSlug(value.asset));
    const includesSelected = selected && inputAssets.some(asset => getAssetKey(asset) === getAssetKey(selected));

    return sortAssetsByValue(selected && !includesSelected ? [...inputAssets, selected] : inputAssets);
  }, [assetsList, field, inputAssets, value.asset]);
  const { pickerAssets, networkFilter, setNetworkFilter, setAssetSearch } = useAssetSelection(assets);

  const handleChange = (newValue: AssetAmountInterface<AssetInterface>): void => {
    if (field === 'input' && newValue.asset.chainKind !== value.asset.chainKind) {
      onSelectInput(newValue.asset);

      return;
    }

    const asset =
      assetsList.find(item => assetsEqualityFn(item, newValue.asset)) ??
      (getAssetSlug(value.asset) === getAssetSlug(newValue.asset) ? value.asset : undefined);
    if (asset) onValueChange({ asset, amount: newValue.amount });
  };

  return (
    <AssetAmountInputV2
      {...props}
      value={{
        ...value,
        asset: assetsList.find(asset => getAssetSlug(asset) === getAssetSlug(value.asset)) ?? value.asset
      }}
      assetsList={pickerAssets}
      onValueChange={handleChange}
      isSearchable
      isLoading={props.isLoading && assets.length === 0}
      searchPlaceholder="Search"
      dropdownDescription="Select Token"
      showTokenNameForValue
      scrollToSelectedOnOpen={false}
      listBalanceTextStyle={styles.tokenListBalance}
      listDollarEquivalentTextStyle={styles.tokenListDollarEquivalent}
      setSearchValue={setAssetSearch}
      dropdownListHeader={
        field === 'input' && tezosAddress && evmAddress ? (
          <AssetNetworkFilter value={networkFilter} onChange={setNetworkFilter} />
        ) : undefined
      }
    />
  );
};

export const SwapInputAssetAmountInput = <TAsset extends AssetInterface>(props: AssetAmountInputProps<TAsset>) => (
  <SwapAssetAmountInput {...props} field="input" />
);

export const SwapOutputAssetAmountInput = <TAsset extends AssetInterface>(props: AssetAmountInputProps<TAsset>) => (
  <SwapAssetAmountInput {...props} field="output" />
);
