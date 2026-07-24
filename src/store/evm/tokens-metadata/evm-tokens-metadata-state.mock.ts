import { mockPersistedState } from 'src/utils/redux';

import { EvmTokensMetadataState } from './evm-tokens-metadata-state';

export const mockEvmTokensMetadataState = mockPersistedState<EvmTokensMetadataState>({
  record: {}
});
