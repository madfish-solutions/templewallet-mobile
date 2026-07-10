import { createAction } from '@reduxjs/toolkit';

import { EvmTokenMetadata } from './evm-tokens-metadata-state';

interface ProcessLoadedEvmTokensMetadataActionPayload {
  chainId: number;
  metadata: Record<string, EvmTokenMetadata>;
}

export const processLoadedEvmTokensMetadataAction = createAction<ProcessLoadedEvmTokensMetadataActionPayload>(
  'evm/tokens-metadata/PROCESS_LOADED_EVM_TOKENS_METADATA'
);
