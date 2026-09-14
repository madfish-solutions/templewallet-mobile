import { Erc20TokenResolutionResult, EvmCollectibleResolutionResult } from 'src/utils/evm/resolve-evm-asset';

export const genericErrorMessage = 'Ooops, something went wrong.\nPlease, try again later.';

export type EvmAssetSuggestion =
  | Extract<Erc20TokenResolutionResult, { type: 'erc20' }>
  | Extract<EvmCollectibleResolutionResult, { type: 'collectible' }>;
