import { EtherlinkTokenInfo } from 'src/apis/etherlink';
import { EvmAssetStandardEnum, EvmTokenMetadata } from 'src/token/interfaces/token-metadata.interface';
import { EvmTokenOnChainMetadata } from 'src/utils/evm/on-chain/types';

export const buildEvmTokenMetadataFromApi = (token: EtherlinkTokenInfo, decimals: number): EvmTokenMetadata => ({
  address: token.address_hash,
  standard: EvmAssetStandardEnum.ERC20,
  name: token.name ?? undefined,
  symbol: token.symbol ?? undefined,
  decimals,
  iconURL: token.icon_url ?? undefined
});

export const buildEvmTokenMetadataFromOnChain = (
  address: HexString,
  metadata: EvmTokenOnChainMetadata,
  decimals: number
): EvmTokenMetadata => ({
  address,
  standard: EvmAssetStandardEnum.ERC20,
  name: metadata.name,
  symbol: metadata.symbol,
  decimals
});
