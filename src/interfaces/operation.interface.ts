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

export type ParameterFa12 = {
  entrypoint: string;
  value: {
    to: string;
    from: string;
    value: string;
  };
};

export type ParameterLiquidityBaking = {
  entrypoint: string;
  value: {
    target: string;
    quantity: string; // can be 'number' or '-number
  };
};

export interface OperationFa12Interface extends OperationInterface {
  parameter: ParameterFa12;
}

export interface OperationLiquidityBakingInterface extends OperationInterface {
  parameter: ParameterLiquidityBaking | ParameterFa12;
}

export type ParamterFa2 = {
  entrypoint: string;
  value: Array<Fa2OpParams>;
};

export interface OperationFa2Interface extends OperationInterface {
  parameter: ParamterFa2;
}
