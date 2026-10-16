import { useMemo, useState } from 'react';

import { tokenEqualityFn } from 'src/components/token-dropdown/token-equality-fn';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata.ts';
import { TezosTokenMetadata } from 'src/token/interfaces/token-metadata.interface';
import { SendAsset, isTezosSendAsset } from 'src/types/send-asset';
import { isCollectibleAsset } from 'src/utils/asset.utils';

export type NetworkFilter = 'all' | TempleChainKind;

export const getInitialSendAsset = (
  assets: SendAsset[],
  initialAssetKey?: string,
  initialToken?: TezosTokenMetadata
): SendAsset =>
  assets.find(item => item.assetKey === initialAssetKey) ??
  assets.find(item => isTezosSendAsset(item) && tokenEqualityFn(item, initialToken)) ??
  assets.find(item => item.assetSlug === TEZ_TOKEN_SLUG) ??
  assets[0];

const filterSendPickerAssets = (
  assets: SendAsset[],
  networkFilter: NetworkFilter,
  assetSearch: string
): SendAsset[] => {
  const normalizedSearch = assetSearch.trim().toLowerCase();

  return assets.filter(
    asset =>
      !isCollectibleAsset(asset) &&
      (networkFilter === 'all' || asset.chainKind === networkFilter) &&
      (!normalizedSearch ||
        asset.name.toLowerCase().includes(normalizedSearch) ||
        asset.symbol.toLowerCase().includes(normalizedSearch) ||
        (asset.chainKind === TempleChainKind.EVM &&
          asset.sendStandard !== 'native' &&
          asset.contractAddress.toLowerCase().includes(normalizedSearch)))
  );
};

/** Keeps collectible assets addressable by an initial asset key without exposing them in the token picker. */
export const useSendAssetSelection = (assets: SendAsset[]) => {
  const [assetSearch, setAssetSearch] = useState('');
  const [networkFilter, setNetworkFilter] = useState<NetworkFilter>('all');

  const pickerAssets = useMemo(
    () => filterSendPickerAssets(assets, networkFilter, assetSearch),
    [assetSearch, assets, networkFilter]
  );

  return { networkFilter, pickerAssets, setAssetSearch, setNetworkFilter };
};
