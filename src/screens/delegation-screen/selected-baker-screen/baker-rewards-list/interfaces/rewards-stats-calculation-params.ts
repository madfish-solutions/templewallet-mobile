import { BigNumber } from 'bignumber.js';

import { BakerInterface } from 'src/apis/baking-bad';
import { BakerRewardInterface } from 'src/interfaces/baker-reward.interface';

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
