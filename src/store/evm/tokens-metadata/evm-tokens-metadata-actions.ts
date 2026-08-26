import { createAction } from '@reduxjs/toolkit';

import { EvmStoredTokenMetadata } from './evm-tokens-metadata-state';

interface ProcessLoadedEvmTokensMetadataActionPayload {
  chainId: number;
  metadata: Record<string, EvmStoredTokenMetadata>;
}

export const processLoadedEvmTokensMetadataAction = createAction<ProcessLoadedEvmTokensMetadataActionPayload>(
  'evm/tokens-metadata/PROCESS_LOADED_EVM_TOKENS_METADATA'
);
