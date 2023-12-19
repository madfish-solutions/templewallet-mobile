import { BakerInterface } from 'src/apis/baking-bad';
import { BakerRewardInterface } from 'src/interfaces/baker-reward.interface';

import { createActions } from '../create-actions';

export const loadSelectedBakerActions = createActions<void, BakerInterface | null, string>(
  'baking/LOAD_SELECTED_BAKER'
);

export const loadBakersListActions = createActions<void, BakerInterface[], string>('baking/LOAD_BAKERS_LIST');

export const loadBakerRewardsListActions = createActions<void, BakerRewardInterface[], string>(
  'baking/LOAD_BAKER_REWARDS_LIST'
);
