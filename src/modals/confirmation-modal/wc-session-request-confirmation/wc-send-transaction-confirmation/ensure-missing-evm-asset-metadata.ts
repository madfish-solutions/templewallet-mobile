import { dispatch } from 'src/store';
import { processLoadedEvmCollectiblesMetadataAction } from 'src/store/evm/collectibles-metadata/evm-collectibles-metadata-actions';
import { buildEvmCollectibleMetadataFromOnChain } from 'src/store/evm/collectibles-metadata/utils';
import { processLoadedEvmTokensMetadataAction } from 'src/store/evm/tokens-metadata/evm-tokens-metadata-actions';
import { buildEvmTokenMetadataFromOnChain } from 'src/store/evm/tokens-metadata/utils';
import { EvmNetworkEssentials } from 'src/types/networks';
import { getEvmCollectibleMetadata, getEvmTokenMetadata } from 'src/utils/evm/on-chain/metadata';
import { EvmAssetStandard, EvmCollectibleAssetStandard } from 'src/utils/evm/on-chain/types';
import { isDefined } from 'src/utils/is-defined';

interface EnsureMissingEvmAssetMetadataParams {
  network: EvmNetworkEssentials;
  chainId: number;
  assetSlug: string;
  standard: EvmAssetStandard.ERC20 | EvmCollectibleAssetStandard;
  contractAddress: HexString;
  tokenId?: string;
  isCancelled: () => boolean;
}

const fetchAndStore = async <TOnChain, TStored>(
  fetchMetadata: () => Promise<TOnChain | undefined>,
  mapToStored: (metadata: TOnChain) => TStored | undefined,
  storeMetadata: (metadata: TStored) => void,
  isCancelled: () => boolean
) => {
  const onChainMetadata = await fetchMetadata();

  if (isCancelled() || !isDefined(onChainMetadata)) {
    return;
  }

  const storedMetadata = mapToStored(onChainMetadata);

  if (isDefined(storedMetadata)) {
    storeMetadata(storedMetadata);
  }
};

export const ensureMissingEvmAssetMetadata = ({
  network,
  chainId,
  assetSlug,
  standard,
  contractAddress,
  tokenId,
  isCancelled
}: EnsureMissingEvmAssetMetadataParams) => {
  if (standard === EvmAssetStandard.ERC20) {
    return fetchAndStore(
      () => getEvmTokenMetadata(network, contractAddress),
      onChainMetadata =>
        isDefined(onChainMetadata.decimals)
          ? buildEvmTokenMetadataFromOnChain(contractAddress, onChainMetadata, onChainMetadata.decimals)
          : undefined,
      metadata => dispatch(processLoadedEvmTokensMetadataAction({ chainId, metadata: { [assetSlug]: metadata } })),
      isCancelled
    );
  }

  return fetchAndStore(
    () => getEvmCollectibleMetadata(network, contractAddress, tokenId, standard),
    onChainMetadata =>
      buildEvmCollectibleMetadataFromOnChain(contractAddress, tokenId ?? '0', standard, onChainMetadata),
    metadata => dispatch(processLoadedEvmCollectiblesMetadataAction({ chainId, metadata: { [assetSlug]: metadata } })),
    isCancelled
  );
};
