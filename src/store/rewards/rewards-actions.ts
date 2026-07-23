import { createAction } from '@reduxjs/toolkit';

import { createActions } from '../create-actions';

import { TkeyRewardsStats } from './rewards-state';

export const loadTkeyRewardsStatsActions = createActions<string, TkeyRewardsStats, string>(
  'rewards/LOAD_TKEY_REWARDS_STATS'
);

export const setHasSeenRewardsAnnouncementAction = createAction('rewards/SET_HAS_SEEN_REWARDS_ANNOUNCEMENT');
