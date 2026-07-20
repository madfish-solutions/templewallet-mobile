import { EtherlinkAddressNftInstance } from 'src/apis/etherlink';
import { EvmCollectibleMetadata } from 'src/token/interfaces/token-metadata.interface';
import { EvmCollectibleAssetStandard, EvmCollectibleOnChainMetadata } from 'src/utils/evm/on-chain/types';
import { normalizeIpfsUri } from 'src/utils/image.utils';

export const buildEvmCollectibleMetadataFromApi = (
  nft: EtherlinkAddressNftInstance,
  standard: EvmCollectibleAssetStandard
): EvmCollectibleMetadata => ({
  address: nft.token.address_hash,
  tokenId: nft.id,
  standard,
  name: nft.token.name ?? undefined,
  symbol: nft.token.symbol ?? undefined,
  collectibleName: nft.metadata?.name ?? undefined,
  image: normalizeIpfsUri(nft.metadata?.image),
  iconURL: nft.image_url ?? undefined
});

export const buildEvmCollectibleMetadataFromOnChain = (
  address: HexString,
  tokenId: string,
  standard: EvmCollectibleAssetStandard,
  metadata: EvmCollectibleOnChainMetadata
): EvmCollectibleMetadata => ({
  ...metadata,
  address,
  tokenId,
  standard
});
