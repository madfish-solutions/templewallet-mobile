import { useMemo } from 'react';

import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useEvmAccountChainAssetsSelector } from 'src/store/evm/assets/evm-assets-selectors';
import { useEvmAccountChainBalancesSelector } from 'src/store/evm/balances/evm-balances-selectors';
import { useEvmChainCollectiblesMetadataSelector } from 'src/store/evm/collectibles-metadata/evm-collectibles-metadata-selectors';
import { useAccountAddressForEvm } from 'src/store/wallet/wallet-selectors';
import { EvmAssetStandardEnum } from 'src/token/interfaces/token-metadata.interface';
import { fromTokenSlug } from 'src/utils/from-token-slug';
import { isPositiveNumber } from 'src/utils/number.util';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

import { EvmDisplayedCollectible } from '../types';

export const useCurrentAccountEvmCollectibles = (): EvmDisplayedCollectible[] => {
  const evmAddress = useAccountAddressForEvm();
  const assets = useEvmAccountChainAssetsSelector(evmAddress, ETHERLINK_MAINNET_CHAIN_ID);
  const balances = useEvmAccountChainBalancesSelector(evmAddress, ETHERLINK_MAINNET_CHAIN_ID);
  const metadatas = useEvmChainCollectiblesMetadataSelector(ETHERLINK_MAINNET_CHAIN_ID);

  return useMemo(() => {
    if (evmAddress == null) {
      return [];
    }

    const collectibles: EvmDisplayedCollectible[] = [];

    for (const [assetSlug, { standard }] of Object.entries(assets)) {
      if (standard !== EvmAssetStandardEnum.ERC721 && standard !== EvmAssetStandardEnum.ERC1155) {
        continue;
      }

      const balance = balances[assetSlug];
      if (!isPositiveNumber(balance)) {
        continue;
      }

      const [, tokenId] = fromTokenSlug(assetSlug);
      if (tokenId == null) {
        continue;
      }

      collectibles.push({
        chainKind: TempleChainKind.EVM,
        slug: assetSlug,
        chainId: ETHERLINK_MAINNET_CHAIN_ID,
        tokenId,
        balance,
        metadata: metadatas[assetSlug]
      });
    }

    return collectibles;
  }, [evmAddress, assets, balances, metadatas]);
};
