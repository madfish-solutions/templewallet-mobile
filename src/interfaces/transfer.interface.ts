// export interface TransferInterface {
//   contract: string;
//   token_id?: number;
//   status: string;
//   amount: string;
//   hash: string;
//   timestamp: string;
//   from: string;
//   to: string;
//   alias: string;
// }

import { ActivityStatusEnum } from '../enums/activity-status.enum';
import { ActivityTypeEnum } from '../enums/activity-type.enum';

export interface TransferInterface {
  allocationFee?: number;
  amount: number;
  bakerFee?: number;
  block?: string;
  counter?: number;
  gasLimit?: number;
  gasUsed?: number;
  hasInternals?: boolean;
  hash: string;
  id: number;
  level?: number;
  parameter?: { entrypoint: string }; //{entrypoint: 'bet', value: {…}};
  sender: { address: string };
  status: ActivityStatusEnum;
  storageFee?: number;
  storageLimit?: number;
  storageUsed?: number;
  target: { alias?: string; address: string };
  timestamp: string; // '2021-07-16T08:49:46Z';
  type: ActivityTypeEnum; // 'transaction';
}
