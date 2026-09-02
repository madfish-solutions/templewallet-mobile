import { EvmCollectibleMetadata, EvmTokenMetadata } from 'src/token/interfaces/token-metadata.interface';
import { EvmCollectibleAssetStandard } from 'src/utils/evm/on-chain/types';

export const genericErrorMessage = 'Ooops, something went wrong.\nPlease, try again later.';

export interface EvmTokenSuggestion {
  type: 'erc20';
  metadata: EvmTokenMetadata & { decimals: number };
  exchangeRate?: number;
}

export interface EvmCollectibleSuggestion {
  type: 'collectible';
  metadata: EvmCollectibleMetadata & { standard: EvmCollectibleAssetStandard };
}

export type EvmAssetSuggestion = EvmTokenSuggestion | EvmCollectibleSuggestion;
