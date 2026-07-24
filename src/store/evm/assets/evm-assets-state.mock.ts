import { mockPersistedState } from 'src/utils/redux';

import { EvmAssetsState } from './evm-assets-state';

export const mockEvmAssetsState = mockPersistedState<EvmAssetsState>({
  record: {}
});
