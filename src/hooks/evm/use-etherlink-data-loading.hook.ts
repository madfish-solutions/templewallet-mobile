import { useIsFocused } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { isAddress } from 'viem';

import { EVM_BALANCES_SYNC_INTERVAL } from 'src/config/fixed-times';
import { useEvmChain } from 'src/hooks/evm/use-evm-chains.hook';
import { useAppStateStatus } from 'src/hooks/use-app-state-status.hook';
import { useUsdToTokenRates } from 'src/store/currency/currency-selectors';
import { useEvmAccountChainAssetsSelector } from 'src/store/evm/assets/evm-assets-selectors';
import { processLoadedEvmCollectiblesMetadataAction } from 'src/store/evm/collectibles-metadata/evm-collectibles-metadata-actions';
import { useEvmChainCollectiblesMetadataSelector } from 'src/store/evm/collectibles-metadata/evm-collectibles-metadata-selectors';
import { processLoadedEvmTokensMetadataAction } from 'src/store/evm/tokens-metadata/evm-tokens-metadata-actions';
import { useEvmChainTokensMetadataSelector } from 'src/store/evm/tokens-metadata/evm-tokens-metadata-selectors';
import { useAccountAddressForEvm } from 'src/store/wallet/wallet-selectors';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { EvmAssetStandardEnum } from 'src/token/interfaces/token-metadata.interface';
import { EvmChain, EvmNetworkEssentials } from 'src/types/networks';
import {
  dispatchEtherlinkAccountData,
  getEtherlinkAccountData,
  loadEtherlinkBalancesOnChain,
  readContractAssetsBalancesOnChain
} from 'src/utils/evm/etherlink-balances.utils';
import { getEvmCollectibleMetadata, getEvmTokenMetadata } from 'src/utils/evm/on-chain/metadata';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

const EMPTY_HEX_ADDRESS: HexString = '0x';

const inFlightMap: Record<string, boolean> = {};
const lastLoadTimestampMap: Record<string, number> = {};
const checkedMetadataSlugs = new Set<string>();
const inFlightMetadataFetches = new Set<string>();

const toNetworkEssentials = (chain: EvmChain): EvmNetworkEssentials => ({
  rpcBaseURL: chain.activeRpc.rpcBaseURL,
  chainId: chain.chainId
});

export const useEtherlinkDataLoading = () => {
  const dispatch = useDispatch();
  const evmAddress = useAccountAddressForEvm();
  const etherlinkChain = useEvmChain(ETHERLINK_MAINNET_CHAIN_ID);
  const nativeUsdRate = useUsdToTokenRates()[TEZ_TOKEN_SLUG];

  const chainAssets = useEvmAccountChainAssetsSelector(evmAddress ?? EMPTY_HEX_ADDRESS, ETHERLINK_MAINNET_CHAIN_ID);
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
  const nativeUsdRateRef = useRef(nativeUsdRate);
  nativeUsdRateRef.current = nativeUsdRate;
  const chainAssetsRef = useRef(chainAssets);
  chainAssetsRef.current = chainAssets;

  const refresh = useCallback(
    async (account: HexString) => {
      const chain = etherlinkChainRef.current;
      if (!chain) {
        return;
      }
      const currentNetwork = toNetworkEssentials(chain);

      const key = `${account}_${ETHERLINK_MAINNET_CHAIN_ID}`;
      if (inFlightMap[key]) {
        return;
      }
      inFlightMap[key] = true;

      try {
        try {
          const data = await getEtherlinkAccountData(ETHERLINK_MAINNET_CHAIN_ID, account);

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

          dispatchEtherlinkAccountData({
            dispatch,
            account,
            chainId: ETHERLINK_MAINNET_CHAIN_ID,
            data,
            nativeUsdRate: nativeUsdRateRef.current,
            preservedSlugs
          });
        } catch (apiError) {
          console.error(apiError);
          await loadEtherlinkBalancesOnChain({
            dispatch,
            network: currentNetwork,
            account,
            chainId: ETHERLINK_MAINNET_CHAIN_ID,
            knownAssets: chainAssetsRef.current
          });
        }

        lastLoadTimestampMap[key] = Date.now();
      } finally {
        inFlightMap[key] = false;
      }
    },
    [dispatch]
  );

  const hasNetwork = etherlinkChain != null;

  useEffect(() => {
    if (!isFocused || !isAppActive || !evmAddress || !hasNetwork) {
      return;
    }

    const key = `${evmAddress}_${ETHERLINK_MAINNET_CHAIN_ID}`;
    const delay = Math.max(0, EVM_BALANCES_SYNC_INTERVAL - (Date.now() - (lastLoadTimestampMap[key] ?? 0)));

    let intervalId: ReturnType<typeof setInterval> | undefined;
    const timeoutId = setTimeout(() => {
      refresh(evmAddress);
      intervalId = setInterval(() => refresh(evmAddress), EVM_BALANCES_SYNC_INTERVAL);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isFocused, isAppActive, evmAddress, hasNetwork, refresh]);

  useEffect(() => {
    const chain = etherlinkChainRef.current;
    if (!chain || !evmAddress) {
      return;
    }
    const currentNetwork = toNetworkEssentials(chain);

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
              metadata: {
                [slug]: {
                  name: metadata.name,
                  symbol: metadata.symbol,
                  decimals: metadata.decimals,
                  standard: EvmAssetStandardEnum.ERC20
                }
              }
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

        const [contract, tokenId] = slug.split('_');
        if (!isAddress(contract)) {
          checkedMetadataSlugs.add(checkedKey);
          continue;
        }

        inFlightMetadataFetches.add(checkedKey);
        (async () => {
          const metadata = await getEvmCollectibleMetadata(currentNetwork, contract, tokenId ?? '0', standard);
          if (metadata == null) {
            checkedMetadataSlugs.add(checkedKey);

            return;
          }

          dispatch(
            processLoadedEvmCollectiblesMetadataAction({
              chainId: ETHERLINK_MAINNET_CHAIN_ID,
              metadata: {
                [slug]: {
                  tokenId: tokenId ?? '0',
                  name: metadata.name,
                  symbol: metadata.symbol,
                  iconUri: metadata.image,
                  collectionName: metadata.name,
                  standard
                }
              }
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
  }, [chainAssets, tokensMetadata, collectiblesMetadata, evmAddress, hasNetwork, dispatch]);
};
