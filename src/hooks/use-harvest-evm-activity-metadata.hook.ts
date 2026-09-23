import { useEffect, useRef } from 'react';
import { isAddress } from 'viem';

import { Activity } from 'src/activity/types';
import { isEvmActivity } from 'src/activity/utils';
import { dispatch } from 'src/store';
import { processLoadedEvmCollectiblesMetadataAction } from 'src/store/evm/collectibles-metadata/evm-collectibles-metadata-actions';
import { useEvmChainCollectiblesMetadataSelector } from 'src/store/evm/collectibles-metadata/evm-collectibles-metadata-selectors';
import { processLoadedEvmTokensMetadataAction } from 'src/store/evm/tokens-metadata/evm-tokens-metadata-actions';
import { useEvmChainTokensMetadataSelector } from 'src/store/evm/tokens-metadata/evm-tokens-metadata-selectors';
import {
  EvmAssetStandardEnum,
  EvmCollectibleMetadata,
  EvmTokenMetadata
} from 'src/token/interfaces/token-metadata.interface';
import { toEvmAssetSlug } from 'src/utils/from-token-slug';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

export const useHarvestEvmActivityMetadata = (activities: Activity[], resetKey: string) => {
  const evmTokensMetadata = useEvmChainTokensMetadataSelector(ETHERLINK_MAINNET_CHAIN_ID);
  const evmCollectiblesMetadata = useEvmChainCollectiblesMetadataSelector(ETHERLINK_MAINNET_CHAIN_ID);

  const harvestedAssetSlugsRef = useRef(new Set<string>());
  const resetKeyRef = useRef(resetKey);

  if (resetKeyRef.current !== resetKey) {
    resetKeyRef.current = resetKey;
    harvestedAssetSlugsRef.current.clear();
  }

  useEffect(() => {
    const harvested = harvestedAssetSlugsRef.current;
    const tokensMetadata: Record<string, EvmTokenMetadata> = {};
    const collectiblesMetadata: Record<string, EvmCollectibleMetadata> = {};

    for (const activity of activities) {
      if (!isEvmActivity(activity)) {
        continue;
      }

      for (const { asset } of activity.operations) {
        if (asset == null) {
          continue;
        }

        const contract = asset.contract.toLowerCase();

        if (!isAddress(contract)) {
          continue;
        }

        const slug = toEvmAssetSlug(contract, asset.tokenId);

        if (harvested.has(slug)) {
          continue;
        }

        if (asset.nft === true) {
          if (!evmCollectiblesMetadata[slug]) {
            collectiblesMetadata[slug] = {
              address: contract,
              tokenId: asset.tokenId ?? '0',
              symbol: asset.symbol,
              iconURL: asset.iconURL
            };
          }

          harvested.add(slug);
        } else if (evmTokensMetadata[slug]) {
          harvested.add(slug);
        } else if (asset.decimals != null) {
          tokensMetadata[slug] = {
            address: contract,
            standard: EvmAssetStandardEnum.ERC20,
            symbol: asset.symbol,
            decimals: asset.decimals,
            iconURL: asset.iconURL
          };

          harvested.add(slug);
        }
      }
    }

    if (Object.keys(tokensMetadata).length > 0) {
      dispatch(processLoadedEvmTokensMetadataAction({ chainId: ETHERLINK_MAINNET_CHAIN_ID, metadata: tokensMetadata }));
    }

    if (Object.keys(collectiblesMetadata).length > 0) {
      dispatch(
        processLoadedEvmCollectiblesMetadataAction({
          chainId: ETHERLINK_MAINNET_CHAIN_ID,
          metadata: collectiblesMetadata
        })
      );
    }
  }, [activities, evmCollectiblesMetadata, evmTokensMetadata]);
};
