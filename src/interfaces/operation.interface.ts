import { ActivityStatusEnum } from '../enums/activity-status.enum';
import { ActivityTypeEnum } from '../enums/activity-type.enum';
import { MemberInterface } from './member.interface';

export interface OperationInterface {
  id: number;
  type: ActivityTypeEnum;
  status: ActivityStatusEnum;
  hash: string;
  block: string;
  amount: number;
  level?: number;
  timestamp: string;
  entrypoint: string;
  parameter?: unknown;
  hasInternals?: boolean;
  contractBalance?: string;
  sender: MemberInterface;
  target: MemberInterface;
  newDelegate?: MemberInterface;
  originatedContract?: MemberInterface;
}

interface Fa2Transaction {
  to_: string;
  amount: string;
  token_id: string;
}

interface Fa2OpParams {
  txs: Array<Fa2Transaction>;
  from_: 'tz1h85hgb9hk4MmLuouLcWWna4wBLtqCq4Ta';
}

export interface OperationFa12Interface extends OperationInterface {
  parameter: {
    entrypoint: string;
    value: {
      to: string;
      from: string;
      value: string;
    };
  };
}

export interface OperationFa2Interface extends OperationInterface {
  parameter: {
    entrypoint: string;
    value: Array<Fa2OpParams>;
  };
}
