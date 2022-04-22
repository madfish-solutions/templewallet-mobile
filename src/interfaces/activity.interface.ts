import { ActivityStatusEnum } from '../enums/activity-status.enum';
import { ActivityTypeEnum } from '../enums/activity-type.enum';
import { emptyMember, MemberInterface } from './member.interface';
// import { emptyMember } from './member.interface';

export interface ActivityInterface {
  type: ActivityTypeEnum;
  status: ActivityStatusEnum;
  hash: string;
  amount: string;
  address?: string;
  id?: number;
  timestamp: number;
  entrypoint?: string;
  source: MemberInterface;
  destination: MemberInterface;
}

// export interface ActivityInterface {
//   allocationFee?: number;
//   amount: number;
//   bakerFee?: number;
//   block?: string;
//   counter?: number;
//   gasLimit?: number;
//   gasUsed?: number;
//   hasInternals?: boolean;
//   hash: string;
//   id: number;
//   level?: number;
//   parameter?: { entrypoint: string }; //{entrypoint: 'bet', value: {…}};
//   sender: { address: string };
//   status: ActivityStatusEnum;
//   storageFee?: number;
//   storageLimit?: number;
//   storageUsed?: number;
//   target: { alias?: string; address: string };
//   timestamp: string; // '2021-07-16T08:49:46Z';
//   type: ActivityTypeEnum; // 'transaction';
// }

export type ActivityGroup = ActivityInterface[];

export const emptyActivity: ActivityInterface = {
  type: ActivityTypeEnum.Transaction,
  status: ActivityStatusEnum.Pending,
  hash: '',
  amount: '',
  id: 0,
  // sender: emptyMember,
  // target: emptyMember,
  timestamp: 0,
  source: emptyMember,
  destination: emptyMember
};
