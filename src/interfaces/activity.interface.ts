import { Activity } from '@temple-wallet/transactions-parser';

import { ActivityStatusEnum } from '../enums/activity-status.enum';
import { ActivityTypeEnum } from '../enums/activity-type.enum';
import { emptyMember, MemberInterface } from './member.interface';

export interface ActivityInterface {
  type: ActivityTypeEnum;
  status: ActivityStatusEnum;
  hash: string;
  amount: string;
  address?: string;
  id: number;
  tokenId?: string;
  timestamp: number;
  entrypoint?: string;
  source: MemberInterface;
  destination: MemberInterface;
  reciever?: MemberInterface;
  level?: number;
}

export type ActivityGroup = Array<Activity>;

export const emptyActivity: ActivityInterface = {
  type: ActivityTypeEnum.Transaction,
  status: ActivityStatusEnum.Pending,
  hash: '',
  amount: '',
  id: 0,
  timestamp: 0,
  source: emptyMember,
  destination: emptyMember
};
