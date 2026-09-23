import { EvmNativeTokenMetadata, EvmTokenMetadata } from 'src/token/interfaces/token-metadata.interface';

export type EvmStoredTokenMetadata = EvmTokenMetadata | EvmNativeTokenMetadata;

export type EvmTokensMetadataRecord = Record<number, Record<string, EvmStoredTokenMetadata>>;

export interface EvmTokensMetadataState {
  record: EvmTokensMetadataRecord;
}

export const evmTokensMetadataInitialState: EvmTokensMetadataState = {
  record: {}
};
