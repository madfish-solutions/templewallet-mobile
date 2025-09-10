import { BakerInterface } from 'src/apis/baking-bad';

import { createActions } from '../create-actions';

export const loadSelectedBakerActions = createActions<void, BakerInterface | null, string>(
  'baking/LOAD_SELECTED_BAKER'
);

export const loadBakersListActions = createActions<void, BakerInterface[], string>('baking/LOAD_BAKERS_LIST');
