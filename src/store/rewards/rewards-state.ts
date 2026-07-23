import { createEntity } from '../create-entity.ts';
import { LoadableEntityState } from '../types';

export interface TkeyRewardsStats {
  lastAmount?: string;
  lastTransferTs?: string;
  total: string;
}

export interface RewardsState {
  hasSeenRewardsAnnouncement: boolean;
  tkeyStats: LoadableEntityState<TkeyRewardsStats | null>;
}

export const rewardsInitialState: RewardsState = {
  hasSeenRewardsAnnouncement: false,
  tkeyStats: createEntity(null)
};
