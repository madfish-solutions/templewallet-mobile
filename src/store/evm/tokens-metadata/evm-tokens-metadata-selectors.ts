import { useSelector } from '../../selector';

import { EvmStoredTokenMetadata } from './evm-tokens-metadata-state';

const EMPTY_EVM_CHAIN_TOKENS_METADATA_RECORD: Record<string, EvmStoredTokenMetadata> = {};

export const useEvmChainTokensMetadataSelector = (chainId: number): Record<string, EvmStoredTokenMetadata> =>
  useSelector(({ evmTokensMetadata }) => evmTokensMetadata.record[chainId]) ?? EMPTY_EVM_CHAIN_TOKENS_METADATA_RECORD;
