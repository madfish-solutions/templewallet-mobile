import { BigNumber } from 'bignumber.js';

import { BakerRewardInterface } from '../../../../../interfaces/baker-reward.interface';
import { BakerInterface } from '../../../../../interfaces/baker.interface';

export interface RewardsStatsCalculationParams
  extends Record<
    | 'fallbackRewardPerOwnBlock'
    | 'fallbackRewardPerEndorsement'
    | 'fallbackRewardPerFutureBlock'
    | 'fallbackRewardPerFutureEndorsement',
    BigNumber
  > {
  reward: BakerRewardInterface;
  bakerDetails?: BakerInterface;
  currentCycle?: number;
}
