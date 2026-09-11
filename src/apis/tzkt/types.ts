export type TzktOperationType = 'delegation' | 'transaction' | 'reveal' | 'origination' | 'set_delegate_parameters';

export interface TzktAlias {
  address: string;
  alias?: string;
}

interface TzktOperationBase {
  type: TzktOperationType;
  id: number;
  level?: number;
  /** ISO date string */
  timestamp: string;
  hash: string;
  sender: TzktAlias;
  status: string;
}

export interface TzktTransactionOperation extends TzktOperationBase {
  type: 'transaction';
  /** Account that sent the outer operation of an internal transaction */
  initiator?: TzktAlias;
  target: TzktAlias;
  amount: number;
  parameter?: unknown;
  entrypoint?: string;
}

interface TzktDelegationOperation extends TzktOperationBase {
  type: 'delegation';
  newDelegate?: TzktAlias | null;
}

interface TzktOriginationOperation extends TzktOperationBase {
  type: 'origination';
  originatedContract?: TzktAlias;
  contractBalance?: string;
}

interface TzktUnhandledOperation extends TzktOperationBase {
  type: Exclude<TzktOperationType, 'transaction' | 'delegation' | 'origination'>;
}

export type TzktOperation =
  | TzktTransactionOperation
  | TzktDelegationOperation
  | TzktOriginationOperation
  | TzktUnhandledOperation;
