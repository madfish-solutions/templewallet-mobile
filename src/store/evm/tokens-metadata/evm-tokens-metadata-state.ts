import { EvmAssetStandardEnum } from 'src/token/interfaces/token-metadata.interface';

export interface EvmTokenMetadata {
  name?: string;
  symbol?: string;
  decimals: number;
  iconUri?: string;
  standard: EvmAssetStandardEnum;
}

export type EvmTokensMetadataRecord = Record<number, Record<string, EvmTokenMetadata>>;

export interface EvmTokensMetadataState {
  record: EvmTokensMetadataRecord;
}

export const evmTokensMetadataInitialState: EvmTokensMetadataState = {
  record: {}
};
