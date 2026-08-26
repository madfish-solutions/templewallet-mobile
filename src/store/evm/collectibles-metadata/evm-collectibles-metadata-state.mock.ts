import { mockPersistedState } from 'src/utils/redux';

import { EvmCollectiblesMetadataState } from './evm-collectibles-metadata-state';

export const mockEvmCollectiblesMetadataState = mockPersistedState<EvmCollectiblesMetadataState>({
  record: {}
});
