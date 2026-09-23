import { useCallback, useEffect, useMemo, useState } from 'react';
import { isAddress } from 'viem';

import { useEvmChain } from 'src/hooks/evm/use-evm-chains.hook';
import { AssetInterface } from 'src/interfaces/asset.interface';
import { useEvmChainCollectiblesMetadataSelector } from 'src/store/evm/collectibles-metadata/evm-collectibles-metadata-selectors';
import { useEvmAssetExchangeRateGetter } from 'src/store/evm/exchange-rates/evm-exchange-rates-selectors';
import { useEvmChainTokensMetadataSelector } from 'src/store/evm/tokens-metadata/evm-tokens-metadata-selectors';
import { toEvmNetworkEssentials } from 'src/types/networks';
import {
  EvmBalanceChange,
  EvmBalancesChangesGroup,
  getEvmBalancesChanges,
  groupBalancesChangesByReceiver
} from 'src/utils/evm/on-chain/transactions';
import { EvmAssetStandard, EvmCollectibleAssetStandard } from 'src/utils/evm/on-chain/types';
import { ParsedEvmRpcTransactionRequest } from 'src/utils/evm/parse-rpc-transaction-request';
import { fromTokenSlug } from 'src/utils/from-token-slug';
import { isDefined } from 'src/utils/is-defined';
import { cancellablePromiseFlow } from 'src/utils/promise.util';

import { buildEvmPreviewAsset, hasUsableEvmPreviewMetadata } from './build-evm-preview-asset';
import { ensureMissingEvmAssetMetadata } from './ensure-missing-evm-asset-metadata';

type FetchableEvmAssetStandard = EvmAssetStandard.ERC20 | EvmCollectibleAssetStandard;

const isFetchableEvmAssetStandard = (standard: EvmAssetStandard): standard is FetchableEvmAssetStandard =>
  standard === EvmAssetStandard.ERC20 || standard === EvmAssetStandard.ERC721 || standard === EvmAssetStandard.ERC1155;

export const useWcEvmBalancesChangesPreview = (
  transaction: ParsedEvmRpcTransactionRequest,
  chainId: number,
  accountAddress: HexString
) => {
  const chain = useEvmChain(chainId);
  const network = useMemo(() => (isDefined(chain) ? toEvmNetworkEssentials(chain) : undefined), [chain]);
  const tokensMetadata = useEvmChainTokensMetadataSelector(chainId);
  const collectiblesMetadata = useEvmChainCollectiblesMetadataSelector(chainId);
  const getExchangeRate = useEvmAssetExchangeRateGetter(chainId);
  const [groups, setGroups] = useState<EvmBalancesChangesGroup[] | null | undefined>();
  const [isMetadataResolved, setIsMetadataResolved] = useState(false);

  useEffect(() => {
    if (!isDefined(network)) {
      setGroups(null);
      setIsMetadataResolved(false);

      return;
    }

    let cancelled = false;
    setGroups(undefined);
    setIsMetadataResolved(false);

    cancellablePromiseFlow({
      promise: getEvmBalancesChanges(transaction, accountAddress, network),
      isCancelled: () => cancelled,
      then: balancesChanges => setGroups(groupBalancesChangesByReceiver(balancesChanges)),
      catch: () => setGroups(null)
    });

    return () => {
      cancelled = true;
    };
  }, [accountAddress, network, transaction]);

  const allChanges = useMemo(() => (isDefined(groups) ? groups.flatMap(group => group.changes) : []), [groups]);

  const missingMetadataKey = useMemo(
    () =>
      allChanges
        .filter(
          change =>
            !hasUsableEvmPreviewMetadata(
              change.standard,
              change.assetSlug,
              chain?.currency,
              tokensMetadata,
              collectiblesMetadata
            )
        )
        .map(change => `${change.assetSlug}:${change.standard}`)
        .sort()
        .join('|'),
    [allChanges, chain?.currency, collectiblesMetadata, tokensMetadata]
  );

  const hasAllUsableMetadata = isDefined(groups) && missingMetadataKey.length === 0;

  useEffect(() => {
    if (!isDefined(groups) || !isDefined(network)) {
      return;
    }

    if (hasAllUsableMetadata) {
      setIsMetadataResolved(true);

      return;
    }

    const assetsToFetch = allChanges.filter(
      (change): change is EvmBalanceChange & { standard: FetchableEvmAssetStandard } =>
        isFetchableEvmAssetStandard(change.standard) &&
        !hasUsableEvmPreviewMetadata(
          change.standard,
          change.assetSlug,
          chain?.currency,
          tokensMetadata,
          collectiblesMetadata
        )
    );

    if (assetsToFetch.length === 0) {
      setIsMetadataResolved(true);

      return;
    }

    let cancelled = false;
    setIsMetadataResolved(false);

    cancellablePromiseFlow({
      promise: Promise.all(
        assetsToFetch.map(change => {
          const [contractAddress, tokenId] = fromTokenSlug<HexString>(change.assetSlug);

          if (!isAddress(contractAddress)) {
            return Promise.resolve();
          }

          return ensureMissingEvmAssetMetadata({
            network,
            chainId,
            assetSlug: change.assetSlug,
            standard: change.standard,
            contractAddress,
            tokenId,
            isCancelled: () => cancelled
          });
        })
      ),
      isCancelled: () => cancelled,
      catch: console.error,
      finally: () => setIsMetadataResolved(true)
    });

    return () => {
      cancelled = true;
    };
  }, [
    allChanges,
    chain?.currency,
    chainId,
    collectiblesMetadata,
    groups,
    hasAllUsableMetadata,
    missingMetadataKey,
    network,
    tokensMetadata
  ]);

  const getAsset = useCallback(
    (change: EvmBalanceChange): AssetInterface | undefined =>
      buildEvmPreviewAsset({
        standard: change.standard,
        assetSlug: change.assetSlug,
        nativeCurrency: chain?.currency,
        tokensMetadata,
        collectiblesMetadata,
        exchangeRate: getExchangeRate(change.assetSlug)
      }),
    [chain?.currency, collectiblesMetadata, getExchangeRate, tokensMetadata]
  );

  const isLoading = groups === undefined || (isDefined(groups) && !hasAllUsableMetadata && !isMetadataResolved);

  return {
    groups,
    getAsset,
    isLoading
  };
};
