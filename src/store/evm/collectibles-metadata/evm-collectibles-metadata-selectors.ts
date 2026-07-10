import { useSelector } from '../../selector';

import { EvmCollectibleMetadata } from './evm-collectibles-metadata-state';

const EMPTY_EVM_CHAIN_COLLECTIBLES_METADATA_RECORD: Record<string, EvmCollectibleMetadata> = {};

export const useEvmChainCollectiblesMetadataSelector = (chainId: number): Record<string, EvmCollectibleMetadata> =>
  useSelector(({ evmCollectiblesMetadata }) => evmCollectiblesMetadata.record[chainId]) ??
  EMPTY_EVM_CHAIN_COLLECTIBLES_METADATA_RECORD;
