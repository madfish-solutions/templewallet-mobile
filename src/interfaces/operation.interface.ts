import { ActivityStatusEnum } from '../enums/activity-status.enum';
import { ActivityTypeEnum } from '../enums/activity-type.enum';
import { MemberInterface } from './member.interface';

export interface OperationInterface {
  type: ActivityTypeEnum;
  status: ActivityStatusEnum;
  hash: string;
  block: string;
  amount: number;
  timestamp: string;
  parameters?: string;
  hasInternals?: boolean;
  contractBalance?: string;
  sender: MemberInterface;
  target: MemberInterface;
  newDelegate?: MemberInterface;
  originatedContract?: MemberInterface;
}
