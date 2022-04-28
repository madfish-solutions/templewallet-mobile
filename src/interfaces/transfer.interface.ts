// import { ActivityStatusEnum } from '../enums/activity-status.enum';
// import { ActivityTypeEnum } from '../enums/activity-type.enum';

export interface TransferInterface {
  contract: string;
  token_id?: number;
  status: string;
  amount: string;
  hash: string;
  timestamp: string;
  from: string;
  to: string;
  alias: string;
}
// export interface TransferInterface {
//   type: ActivityTypeEnum;
//   allocationFee: number;
//   amount: number;
//   bakerFee: number;
//   block: string;
//   counter: number;
//   gasLimit: 1520;
//   gasUsed: 1420;
//   hasInternals: boolean;
//   hash: string;
//   id: number;
//   level: number;
//   sender: { alias?: string; address: string };
//   status: ActivityStatusEnum;
//   storageFee: number;
//   storageLimit: number;
//   storageUsed: number;
//   target: { alias?: string; address: string };
//   timestamp: string; //date
//   parameter?: {
//     entrypoint: string; // contract entrypoint
//     value: object;
//   };
// }
