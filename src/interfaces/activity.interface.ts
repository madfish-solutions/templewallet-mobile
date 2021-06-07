import { BigNumber } from 'bignumber.js';

import { ActivityStatusEnum } from '../enums/activity-status.enum';
import { ActivityTypeEnum } from '../enums/activity-type.enum';
import { emptyMember, MemberInterface } from './member.interface';

export interface ActivityInterface {
  type: ActivityTypeEnum;
  status: ActivityStatusEnum;
  hash: string;
  amount: BigNumber;
  tokenSymbol: string;
  tokenName: string;
  tokenSlug?: string;
  timestamp: number;
  entrypoint?: string;
  source: MemberInterface;
  destination: MemberInterface;
}

export type ActivityGroup = ActivityInterface[];

export const emptyActivity: ActivityInterface = {
  type: ActivityTypeEnum.Transaction,
  status: ActivityStatusEnum.Pending,
  hash: '',
  amount: new BigNumber(0),
  tokenSymbol: '',
  tokenName: '',
  timestamp: 0,
  source: emptyMember,
  destination: emptyMember
};
