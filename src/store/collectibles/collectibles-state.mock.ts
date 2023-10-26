import { mockPersistedState } from 'src/utils/redux';

import { createEntity } from '../create-entity';

import type { CollectiblesState } from './collectibles-state';

export const mockCollectiblesState = mockPersistedState<CollectiblesState>({
  details: createEntity({}),
  adultFlags: {}
});
