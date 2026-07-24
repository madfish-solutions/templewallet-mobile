import { useIsFocused } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { isAddress } from 'viem';

import { EVM_BALANCES_SYNC_INTERVAL } from 'src/config/fixed-times';
import { useEvmChain } from 'src/hooks/evm/use-evm-chains.hook';
import { useAppStateStatus } from 'src/hooks/use-app-state-status.hook';
import { dispatch } from 'src/store';
import { useEvmAccountChainAssetsSelector } from 'src/store/evm/assets/evm-assets-selectors';
import { processLoadedEvmCollectiblesMetadataAction } from 'src/store/evm/collectibles-metadata/evm-collectibles-metadata-actions';
import { useEvmChainCollectiblesMetadataSelector } from 'src/store/evm/collectibles-metadata/evm-collectibles-metadata-selectors';
import { buildEvmCollectibleMetadataFromOnChain } from 'src/store/evm/collectibles-metadata/utils';
import { processLoadedEvmTokensMetadataAction } from 'src/store/evm/tokens-metadata/evm-tokens-metadata-actions';
import { useEvmChainTokensMetadataSelector } from 'src/store/evm/tokens-metadata/evm-tokens-metadata-selectors';
import { buildEvmTokenMetadataFromOnChain } from 'src/store/evm/tokens-metadata/utils';
import { useAccountAddressForEvm } from 'src/store/wallet/wallet-selectors';
import { EvmAssetStandardEnum } from 'src/token/interfaces/token-metadata.interface';
import { toEvmNetworkEssentials } from 'src/types/networks';
import {
  dispatchEtherlinkAccountData,
  getEtherlinkAccountData,
  loadEtherlinkBalancesOnChain,
  readContractAssetsBalancesOnChain
} from 'src/utils/evm/etherlink-balances.utils';
import { getEvmCollectibleMetadata, getEvmTokenMetadata } from 'src/utils/evm/on-chain/metadata';
import { fromTokenSlug } from 'src/utils/from-token-slug';
import { useInterval } from 'src/utils/hooks/use-interval';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

const inFlightMap: Record<string, boolean> = {};
const lastLoadTimestampMap: Record<string, number> = {};
/** Slightly below the sync interval, so a tick arriving a few ms early is not skipped for a whole period */
const REFRESH_THROTTLE = EVM_BALANCES_SYNC_INTERVAL - 5000;
const checkedMetadataSlugs = new Set<string>();
const inFlightMetadataFetches = new Set<string>();

export const useEtherlinkDataLoading = () => {
  const evmAddress = useAccountAddressForEvm();
  const etherlinkChain = useEvmChain(ETHERLINK_MAINNET_CHAIN_ID);

  const chainAssets = useEvmAccountChainAssetsSelector(evmAddress, ETHERLINK_MAINNET_CHAIN_ID);
  const tokensMetadata = useEvmChainTokensMetadataSelector(ETHERLINK_MAINNET_CHAIN_ID);
  const collectiblesMetadata = useEvmChainCollectiblesMetadataSelector(ETHERLINK_MAINNET_CHAIN_ID);

  const isFocused = useIsFocused();
  const [isAppActive, setIsAppActive] = useState(true);
  useAppStateStatus({
    onAppActiveState: () => setIsAppActive(true),
    onAppInactiveState: () => setIsAppActive(false),
    onAppBackgroundState: () => setIsAppActive(false)
  });

  const etherlinkChainRef = useRef(etherlinkChain);
  etherlinkChainRef.current = etherlinkChain;
  const chainAssetsRef = useRef(chainAssets);
  chainAssetsRef.current = chainAssets;

  const refresh = useCallback(async (account: HexString) => {
    const chain = etherlinkChainRef.current;
    if (!chain) {
      return;
    }
    const currentNetwork = toEvmNetworkEssentials(chain);

    const key = `${account}_${ETHERLINK_MAINNET_CHAIN_ID}`;
    if (inFlightMap[key] || Date.now() - (lastLoadTimestampMap[key] ?? 0) < REFRESH_THROTTLE) {
      return;
    }
    inFlightMap[key] = true;
    lastLoadTimestampMap[key] = Date.now();

    try {
      try {
        const data = await getEtherlinkAccountData(account);

        // Manual assets may be missing from the API response, but their balances must survive the refresh
        const chainAssets = chainAssetsRef.current;
        const manualAssetsMissingFromApi: typeof chainAssets = {};
        for (const slug in chainAssets) {
          if (chainAssets[slug].manual && data.balances[slug] == null) {
            manualAssetsMissingFromApi[slug] = chainAssets[slug];
          }
        }

        let preservedSlugs: string[] | undefined;
        if (Object.keys(manualAssetsMissingFromApi).length > 0) {
          const manualResult = await readContractAssetsBalancesOnChain(
            currentNetwork,
            account,
            manualAssetsMissingFromApi
          );
          Object.assign(data.balances, manualResult.balances);
          preservedSlugs = manualResult.failed;
        }

        dispatchEtherlinkAccountData({ account, data, preservedSlugs });
      } catch (apiError) {
        console.error(apiError);
        await loadEtherlinkBalancesOnChain({
          network: currentNetwork,
          account,
          knownAssets: chainAssetsRef.current
        });
      }
    } finally {
      inFlightMap[key] = false;
    }
  }, []);

  const hasNetwork = etherlinkChain != null;

  useInterval(
    () => {
      if (isFocused && isAppActive && evmAddress && hasNetwork) {
        refresh(evmAddress);
      }
    },
    EVM_BALANCES_SYNC_INTERVAL,
    [isFocused, isAppActive, evmAddress, hasNetwork]
  );

  useEffect(() => {
    const chain = etherlinkChainRef.current;
    if (!chain || !evmAddress) {
      return;
    }
    const currentNetwork = toEvmNetworkEssentials(chain);

    for (const slug in chainAssets) {
      const { standard } = chainAssets[slug];
      if (standard === EvmAssetStandardEnum.NATIVE) {
        continue;
      }

      const checkedKey = `${ETHERLINK_MAINNET_CHAIN_ID}_${slug}`;
      if (checkedMetadataSlugs.has(checkedKey) || inFlightMetadataFetches.has(checkedKey)) {
        continue;
      }

      if (standard === EvmAssetStandardEnum.ERC20) {
        if (tokensMetadata[slug]) {
          continue;
        }

        if (!isAddress(slug)) {
          checkedMetadataSlugs.add(checkedKey);
          continue;
        }

        inFlightMetadataFetches.add(checkedKey);
        (async () => {
          const metadata = await getEvmTokenMetadata(currentNetwork, slug);
          if (metadata == null || metadata.decimals == null) {
            checkedMetadataSlugs.add(checkedKey);

            return;
          }

          dispatch(
            processLoadedEvmTokensMetadataAction({
              chainId: ETHERLINK_MAINNET_CHAIN_ID,
              metadata: { [slug]: buildEvmTokenMetadataFromOnChain(slug, metadata, metadata.decimals) }
            })
          );
          checkedMetadataSlugs.add(checkedKey);
        })()
          .catch(error => console.error(error))
          .finally(() => {
            inFlightMetadataFetches.delete(checkedKey);
          });
      } else {
        if (collectiblesMetadata[slug]) {
          continue;
        }

        const [contract, tokenId] = fromTokenSlug(slug);
        if (!isAddress(contract)) {
          checkedMetadataSlugs.add(checkedKey);
          continue;
        }

        inFlightMetadataFetches.add(checkedKey);
        (async () => {
          const metadata = await getEvmCollectibleMetadata(currentNetwork, contract, tokenId, standard);
          if (metadata == null) {
            checkedMetadataSlugs.add(checkedKey);

            return;
          }

          dispatch(
            processLoadedEvmCollectiblesMetadataAction({
              chainId: ETHERLINK_MAINNET_CHAIN_ID,
              metadata: { [slug]: buildEvmCollectibleMetadataFromOnChain(contract, tokenId ?? '0', standard, metadata) }
            })
          );
          checkedMetadataSlugs.add(checkedKey);
        })()
          .catch(error => console.error(error))
          .finally(() => {
            inFlightMetadataFetches.delete(checkedKey);
          });
      }
    }
  }, [chainAssets, tokensMetadata, collectiblesMetadata, evmAddress, hasNetwork]);
};
