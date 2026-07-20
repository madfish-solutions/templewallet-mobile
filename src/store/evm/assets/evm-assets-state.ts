import { EvmAssetStandardEnum } from 'src/token/interfaces/token-metadata.interface';

interface EvmAssetRecordEntry {
  standard: EvmAssetStandardEnum;
  /** `true` if manually added/flagged by the user, preserved across API refreshes.
   * Only the debug screen sets it until the manage-assets ticket ships the real UI. */
  manual: boolean;
}

export type EvmChainAssetsRecord = Record<string, EvmAssetRecordEntry>;

export type EvmAssetsRecord = Record<HexString, Record<number, EvmChainAssetsRecord>>;

export interface EvmAssetsState {
  record: EvmAssetsRecord;
}

export const evmAssetsInitialState: EvmAssetsState = {
  record: {}
};
