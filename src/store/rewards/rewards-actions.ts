import { createActions } from '../create-actions';

import { TkeyRewardsStats } from './rewards-state';

export const loadTkeyRewardsStatsActions = createActions<string, TkeyRewardsStats, string>(
  'rewards/LOAD_TKEY_REWARDS_STATS'
);
