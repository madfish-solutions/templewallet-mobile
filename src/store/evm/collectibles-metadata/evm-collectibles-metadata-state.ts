import { EvmCollectibleMetadata } from 'src/token/interfaces/token-metadata.interface';

export type EvmCollectiblesMetadataRecord = Record<number, Record<string, EvmCollectibleMetadata>>;

export interface EvmCollectiblesMetadataState {
  record: EvmCollectiblesMetadataRecord;
}

export const evmCollectiblesMetadataInitialState: EvmCollectiblesMetadataState = {
  record: {}
};
