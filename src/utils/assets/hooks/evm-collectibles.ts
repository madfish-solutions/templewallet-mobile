import { useMemo } from 'react';

import { VisibilityEnum } from 'src/enums/visibility.enum';
import { useEvmAccountChainAssetsSelector } from 'src/store/evm/assets/evm-assets-selectors';
import { useEvmAccountChainBalancesSelector } from 'src/store/evm/balances/evm-balances-selectors';
import { useEvmChainCollectiblesMetadataSelector } from 'src/store/evm/collectibles-metadata/evm-collectibles-metadata-selectors';
import { useAccountAddressForEvm } from 'src/store/wallet/wallet-selectors';
import { EvmAssetStandardEnum } from 'src/token/interfaces/token-metadata.interface';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

import { UsableAccountAsset } from '../types';

const EVM_COLLECTIBLE_SLUG_PREFIX = 'evm';

const buildEvmCollectibleSlug = (chainId: number, assetSlug: string) =>
  `${EVM_COLLECTIBLE_SLUG_PREFIX}_${chainId}_${assetSlug}`;

export const isEvmCollectibleSlug = (slug: string) => slug.startsWith(`${EVM_COLLECTIBLE_SLUG_PREFIX}_`);

export const useCurrentAccountEvmCollectibles = (): UsableAccountAsset[] => {
  const evmAddress = useAccountAddressForEvm();
  const assets = useEvmAccountChainAssetsSelector(evmAddress ?? '0x', ETHERLINK_MAINNET_CHAIN_ID);
  const balances = useEvmAccountChainBalancesSelector(evmAddress ?? '0x', ETHERLINK_MAINNET_CHAIN_ID);
  const metadatas = useEvmChainCollectiblesMetadataSelector(ETHERLINK_MAINNET_CHAIN_ID);

  return useMemo(() => {
    if (evmAddress == null) {
      return [];
    }

    return Object.entries(assets).reduce<UsableAccountAsset[]>((acc, [assetSlug, { standard }]) => {
      if (standard !== EvmAssetStandardEnum.ERC721 && standard !== EvmAssetStandardEnum.ERC1155) {
        return acc;
      }

      const balance = balances[assetSlug];
      if (balance == null || Number(balance) <= 0) {
        return acc;
      }

      const metadata = metadatas[assetSlug];
      const [contract, tokenId] = assetSlug.split('_');

      return acc.concat({
        slug: buildEvmCollectibleSlug(ETHERLINK_MAINNET_CHAIN_ID, assetSlug),
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
    }, []);
  }, [evmAddress, assets, balances, metadatas]);
};
