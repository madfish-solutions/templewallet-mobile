import { TzktQuote, TzktQuoteCurrency, TzktRewardsEntry } from 'src/interfaces/tzkt/rewards-entry.interface';

export const allInt32ParameterKeys = ['eq', 'ne', 'gt', 'ge', 'lt', 'le', 'in', 'ni'] as const;

type Int32ParameterKey = (typeof allInt32ParameterKeys)[number];
type Int32Parameter = Partial<Record<Int32ParameterKey, number>>;

export type TzktGetRewardsParams = {
  address: string;
  cycle?: Int32Parameter;
  sort?: 'asc' | 'desc';
  offset?: number;
  limit?: number;
  quote?: TzktQuoteCurrency[];
};

export type TzktGetRewardsResponse = TzktRewardsEntry[] | undefined;

export type GetOperationsBaseParams = {
  limit?: number;
  offset?: number;
  entrypoint?: 'transfer' | 'mintOrBurn';
  lastId?: number;
} & {
  [key in `timestamp.${'lt' | 'ge'}`]?: string;
} & {
  [key in `level.${'lt' | 'ge'}`]?: number;
} & {
  [key in `target${'' | '.ne'}`]?: string;
} & {
  [key in `sender${'' | '.ne'}`]?: string;
} & {
  [key in `initiator${'' | '.ne'}`]?: string;
};

export type OperationSortParams = {
  [key in `sort${'' | '.desc'}`]?: 'id' | 'level';
};

export interface TzktSetDelegateParamsOperation extends TzktOperationBase {
  type: 'set_delegate_parameters';
  bakerFee: number;
  limitOfStakingOverBaking: number;
  edgeOfBakingOverStaking: number;
  activationCycle: number;
}

/**
 * Actually, there is a bunch of other types but only these will be used for now
 */
type TzktOperationType = 'delegation' | 'transaction' | 'reveal' | 'origination' | 'set_delegate_parameters';

type TzktOperationStatus = 'applied' | 'failed' | 'backtracked' | 'skipped';

interface TzktAlias {
  alias?: string;
  address: string;
}

interface TzktOperationError {
  type: string;
}

/**
 * To be reviewed if a new operation type is added
 */
interface TzktOperationBase {
  type: TzktOperationType;
  id: number;
  level?: number;
  /** ISO Date */
  timestamp: string;
  block?: string;
  hash: string;
  counter: number;
  sender: TzktAlias;
  gasLimit: number;
  gasUsed: number;
  bakerFee: number;
  quote?: TzktQuote;
  errors?: TzktOperationError[] | null;
  status: TzktOperationStatus;
}
