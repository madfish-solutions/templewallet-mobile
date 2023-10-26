import { Activity, ActivityType, TzktOperationStatus } from '@temple-wallet/transactions-parser';
import { BigNumber } from 'bignumber.js';

import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';

import { emptyMember } from './member.interface';

export type ActivityGroup = Array<Activity>;

export const emptyActivity: Activity = {
  type: ActivityType.Send,
  status: TzktOperationStatus.Applied,
  hash: '',
  tokensDeltas: [{ atomicAmount: new BigNumber(0), tokenSlug: TEZ_TOKEN_SLUG }],
  id: 0,
  timestamp: '',
  from: emptyMember,
  to: emptyMember,
  _isSecondary: false,
  parameter: undefined
};
