import { createAction } from '@reduxjs/toolkit';

import { EvmCollectibleMetadata } from './evm-collectibles-metadata-state';

interface ProcessLoadedEvmCollectiblesMetadataActionPayload {
  chainId: number;
  metadata: Record<string, EvmCollectibleMetadata>;
}

export const processLoadedEvmCollectiblesMetadataAction =
  createAction<ProcessLoadedEvmCollectiblesMetadataActionPayload>(
    'evm/collectibles-metadata/PROCESS_LOADED_EVM_COLLECTIBLES_METADATA'
  );
