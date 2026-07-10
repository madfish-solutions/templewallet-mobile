import { EvmAssetStandardEnum } from 'src/token/interfaces/token-metadata.interface';

export interface EvmCollectibleMetadata {
  name?: string;
  symbol?: string;
  tokenId: string;
  iconUri?: string;
  standard: EvmAssetStandardEnum;
  collectionName?: string;
}

export type EvmCollectiblesMetadataRecord = Record<number, Record<string, EvmCollectibleMetadata>>;

export interface EvmCollectiblesMetadataState {
  record: EvmCollectiblesMetadataRecord;
}

export const evmCollectiblesMetadataInitialState: EvmCollectiblesMetadataState = {
  record: {}
};
