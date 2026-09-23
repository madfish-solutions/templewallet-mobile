import { EvmAssetStandardEnum, EvmCollectibleAttribute } from 'src/token/interfaces/token-metadata.interface';

export { EvmAssetStandardEnum as EvmAssetStandard };

export type EvmContractAssetStandard =
  | EvmAssetStandardEnum.ERC20
  | EvmAssetStandardEnum.ERC721
  | EvmAssetStandardEnum.ERC1155;

export type EvmCollectibleAssetStandard = EvmAssetStandardEnum.ERC721 | EvmAssetStandardEnum.ERC1155;

export interface EvmTokenOnChainMetadata {
  name?: string;
  symbol?: string;
  decimals?: number;
}

export interface EvmCollectibleOnChainMetadata {
  name?: string;
  symbol?: string;
  collectibleName?: string;
  metadataUri: string;
  image?: string;
  description?: string;
  attributes?: EvmCollectibleAttribute[];
  externalUrl?: string;
  animationUrl?: string;
}
