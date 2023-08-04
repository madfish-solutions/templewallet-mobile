import { Activity, ActivityType, TzktOperationStatus } from '@temple-wallet/transactions-parser';
import { BigNumber } from 'bignumber.js';

import { emptyMember } from './member.interface';

export type ActivityGroup = Array<Activity>;

export const emptyActivity: Activity = {
  type: ActivityType.Send,
  status: TzktOperationStatus.Applied,
  hash: '',
  tokensDeltas: [{ atomicAmount: new BigNumber(0), tokenSlug: 'tez' }],
  id: 0,
  timestamp: '',
  from: emptyMember,
  to: emptyMember
};
