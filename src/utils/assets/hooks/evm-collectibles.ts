import { useMemo } from 'react';

import { VisibilityEnum } from 'src/enums/visibility.enum';
import { useEvmAccountChainAssetsSelector } from 'src/store/evm/assets/evm-assets-selectors';
import { useEvmAccountChainBalancesSelector } from 'src/store/evm/balances/evm-balances-selectors';
import { useEvmChainCollectiblesMetadataSelector } from 'src/store/evm/collectibles-metadata/evm-collectibles-metadata-selectors';
import { useAccountAddressForEvm } from 'src/store/wallet/wallet-selectors';
import { EvmAssetStandardEnum } from 'src/token/interfaces/token-metadata.interface';
import { fromTokenSlug } from 'src/utils/from-token-slug';
import { isPositiveNumber } from 'src/utils/number.util';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

import { UsableAccountAsset } from '../types';

const EVM_COLLECTIBLE_SLUG_PREFIX = 'evm';

const buildEvmCollectibleSlug = (chainId: number, assetSlug: string) =>
  `${EVM_COLLECTIBLE_SLUG_PREFIX}_${chainId}_${assetSlug}`;

export const isEvmCollectibleSlug = (slug: string) => slug.startsWith(`${EVM_COLLECTIBLE_SLUG_PREFIX}_`);

export const useCurrentAccountEvmCollectibles = (): UsableAccountAsset[] => {
  const evmAddress = useAccountAddressForEvm();
  const assets = useEvmAccountChainAssetsSelector(evmAddress, ETHERLINK_MAINNET_CHAIN_ID);
  const balances = useEvmAccountChainBalancesSelector(evmAddress, ETHERLINK_MAINNET_CHAIN_ID);
  const metadatas = useEvmChainCollectiblesMetadataSelector(ETHERLINK_MAINNET_CHAIN_ID);

  return useMemo(() => {
    if (evmAddress == null) {
      return [];
    }

    const collectibles: UsableAccountAsset[] = [];

    for (const [assetSlug, { standard }] of Object.entries(assets)) {
      if (standard !== EvmAssetStandardEnum.ERC721 && standard !== EvmAssetStandardEnum.ERC1155) {
        continue;
      }

      const balance = balances[assetSlug];
      if (!isPositiveNumber(balance)) {
        continue;
      }

      const metadata = metadatas[assetSlug];
      const [contract, tokenId] = fromTokenSlug(assetSlug);

      collectibles.push({
        slug: buildEvmCollectibleSlug(ETHERLINK_MAINNET_CHAIN_ID, assetSlug),
        // Imprecise for uint256 ids above 2^53, `slug` carries the exact tokenId and is the identity field
        id: Number(tokenId),
        address: contract,
        name: metadata?.name ?? tokenId,
        symbol: metadata?.symbol ?? '',
        decimals: 0,
        balance,
        visibility: VisibilityEnum.Visible,
        artifactUri: metadata?.iconUri,
        displayUri: metadata?.iconUri,
        thumbnailUri: metadata?.iconUri
      });
    }

    return collectibles;
  }, [evmAddress, assets, balances, metadatas]);
};
