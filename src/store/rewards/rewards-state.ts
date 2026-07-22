import { createEntity } from '../create-entity.ts';
import { LoadableEntityState } from '../types';

export interface TkeyRewardsStats {
  lastAmount?: string;
  lastTransferTs?: string;
  total: string;
}

export interface RewardsState {
  tkeyStats: LoadableEntityState<TkeyRewardsStats | null>;
}

export const rewardsInitialState: RewardsState = {
  tkeyStats: createEntity(null)
};
