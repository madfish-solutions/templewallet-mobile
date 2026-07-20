import { createAction } from '@reduxjs/toolkit';

import { EvmCollectibleMetadata } from 'src/token/interfaces/token-metadata.interface';

interface ProcessLoadedEvmCollectiblesMetadataActionPayload {
  chainId: number;
  metadata: Record<string, EvmCollectibleMetadata>;
}

export const processLoadedEvmCollectiblesMetadataAction =
  createAction<ProcessLoadedEvmCollectiblesMetadataActionPayload>(
    'evm/collectibles-metadata/PROCESS_LOADED_EVM_COLLECTIBLES_METADATA'
  );
