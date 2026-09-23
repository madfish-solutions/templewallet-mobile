import { useEffect, useMemo, useState } from 'react';
import { isAddress } from 'viem';

import { useEvmChain } from 'src/hooks/evm/use-evm-chains.hook';
import { AssetInterface } from 'src/interfaces/asset.interface';
import { useEvmChainCollectiblesMetadataSelector } from 'src/store/evm/collectibles-metadata/evm-collectibles-metadata-selectors';
import { useEvmAssetExchangeRate } from 'src/store/evm/exchange-rates/evm-exchange-rates-selectors';
import { useEvmChainTokensMetadataSelector } from 'src/store/evm/tokens-metadata/evm-tokens-metadata-selectors';
import { EvmNetworkEssentials, toEvmNetworkEssentials } from 'src/types/networks';
import { EvmAssetStandard } from 'src/utils/evm/on-chain/types';
import { ParsedEvmRpcTransactionRequest } from 'src/utils/evm/parse-rpc-transaction-request';
import { fromTokenSlug } from 'src/utils/from-token-slug';
import { isDefined } from 'src/utils/is-defined';
import { cancellablePromiseFlow } from 'src/utils/promise.util';

import { buildEvmPreviewAsset, hasUsableEvmPreviewMetadata } from './build-evm-preview-asset';
import { ensureMissingEvmAssetMetadata } from './ensure-missing-evm-asset-metadata';

interface EvmOperationAssetRef {
  assetSlug: string;
  standard: EvmAssetStandard;
}

type FetchOperationDetails<T extends EvmOperationAssetRef> = (
  transaction: ParsedEvmRpcTransactionRequest,
  accountAddress: HexString,
  network: EvmNetworkEssentials
) => Promise<T | null>;

export const useWcEvmOperationAsset = <T extends EvmOperationAssetRef>(
  transaction: ParsedEvmRpcTransactionRequest,
  chainId: number,
  accountAddress: HexString,
  fetchDetails: FetchOperationDetails<T>
) => {
  const chain = useEvmChain(chainId);
  const network = useMemo(() => (isDefined(chain) ? toEvmNetworkEssentials(chain) : undefined), [chain]);
  const tokensMetadata = useEvmChainTokensMetadataSelector(chainId);
  const collectiblesMetadata = useEvmChainCollectiblesMetadataSelector(chainId);
  const [details, setDetails] = useState<T | null | undefined>();
  const [isMetadataResolved, setIsMetadataResolved] = useState(false);

  useEffect(() => {
    if (!isDefined(network)) {
      setDetails(null);
      setIsMetadataResolved(false);

      return;
    }

    let cancelled = false;
    setDetails(undefined);
    setIsMetadataResolved(false);

    cancellablePromiseFlow({
      promise: fetchDetails(transaction, accountAddress, network),
      isCancelled: () => cancelled,
      then: result => setDetails(result),
      catch: () => setDetails(null)
    });

    return () => {
      cancelled = true;
    };
  }, [accountAddress, fetchDetails, network, transaction]);

  const hasUsableMetadata =
    isDefined(details) &&
    hasUsableEvmPreviewMetadata(
      details.standard,
      details.assetSlug,
      chain?.currency,
      tokensMetadata,
      collectiblesMetadata
    );

  useEffect(() => {
    if (!isDefined(details) || !isDefined(network)) {
      return;
    }

    if (details.standard === EvmAssetStandard.NATIVE || hasUsableMetadata) {
      setIsMetadataResolved(true);

      return;
    }

    if (
      details.standard !== EvmAssetStandard.ERC20 &&
      details.standard !== EvmAssetStandard.ERC721 &&
      details.standard !== EvmAssetStandard.ERC1155
    ) {
      setIsMetadataResolved(true);

      return;
    }

    const [contractAddress, tokenId] = fromTokenSlug<HexString>(details.assetSlug);

    if (!isAddress(contractAddress)) {
      setIsMetadataResolved(true);

      return;
    }

    let cancelled = false;
    setIsMetadataResolved(false);

    cancellablePromiseFlow({
      promise: ensureMissingEvmAssetMetadata({
        network,
        chainId,
        assetSlug: details.assetSlug,
        standard: details.standard,
        contractAddress,
        tokenId,
        isCancelled: () => cancelled
      }),
      isCancelled: () => cancelled,
      catch: console.error,
      finally: () => setIsMetadataResolved(true)
    });

    return () => {
      cancelled = true;
    };
  }, [chainId, details, hasUsableMetadata, network]);

  const exchangeRate = useEvmAssetExchangeRate(chainId, details?.assetSlug);

  const asset = useMemo((): AssetInterface | undefined => {
    if (!isDefined(details)) {
      return undefined;
    }

    return buildEvmPreviewAsset({
      standard: details.standard,
      assetSlug: details.assetSlug,
      nativeCurrency: chain?.currency,
      tokensMetadata,
      collectiblesMetadata,
      exchangeRate
    });
  }, [chain?.currency, collectiblesMetadata, details, exchangeRate, tokensMetadata]);

  const isLoading = details === undefined || (isDefined(details) && !hasUsableMetadata && !isMetadataResolved);

  return {
    details,
    asset,
    isLoading
  };
};
