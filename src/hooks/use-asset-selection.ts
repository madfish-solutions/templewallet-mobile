import { useMemo, useState } from 'react';

import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { AssetInterface } from 'src/interfaces/asset.interface';
import { isCollectibleAsset } from 'src/utils/asset.utils';

export type NetworkFilter = 'all' | TempleChainKind;

const filterPickerAssets = <TAsset extends AssetInterface>(
  assets: TAsset[],
  networkFilter: NetworkFilter,
  assetSearch: string
): TAsset[] => {
  const normalizedSearch = assetSearch.trim().toLowerCase();

  return assets.filter(
    asset =>
      !isCollectibleAsset(asset) &&
      (networkFilter === 'all' || asset.chainKind === networkFilter) &&
      (!normalizedSearch ||
        asset.name.toLowerCase().includes(normalizedSearch) ||
        asset.symbol.toLowerCase().includes(normalizedSearch) ||
        ('address' in asset &&
          typeof asset.address === 'string' &&
          asset.address.toLowerCase().includes(normalizedSearch)) ||
        (asset.chainKind === TempleChainKind.EVM &&
          'contractAddress' in asset &&
          typeof asset.contractAddress === 'string' &&
          asset.contractAddress.toLowerCase().includes(normalizedSearch)))
  );
};

export const useAssetSelection = <TAsset extends AssetInterface>(assets: TAsset[]) => {
  const [assetSearch, setAssetSearch] = useState('');
  const [networkFilter, setNetworkFilter] = useState<NetworkFilter>('all');

  const pickerAssets = useMemo(
    () => filterPickerAssets(assets, networkFilter, assetSearch),
    [assetSearch, assets, networkFilter]
  );

  return { networkFilter, pickerAssets, setAssetSearch, setNetworkFilter };
};
