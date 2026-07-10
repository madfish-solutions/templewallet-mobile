import { useSelector } from '../../selector';

import { EvmTokenMetadata } from './evm-tokens-metadata-state';

const EMPTY_EVM_CHAIN_TOKENS_METADATA_RECORD: Record<string, EvmTokenMetadata> = {};

export const useEvmChainTokensMetadataSelector = (chainId: number): Record<string, EvmTokenMetadata> =>
  useSelector(({ evmTokensMetadata }) => evmTokensMetadata.record[chainId]) ?? EMPTY_EVM_CHAIN_TOKENS_METADATA_RECORD;
