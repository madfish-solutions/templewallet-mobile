import type { TzktOperation, TzktOperationType } from 'src/apis/tzkt/types';

import type { OperationMember } from '../types';

export interface TempleTzktOperationsGroup {
  hash: string;
  operations: TzktOperation[];
}

export type TezosPreActivityStatus = 'applied' | 'backtracked' | 'skipped' | 'failed' | 'pending';

export interface TezosActivityOlderThan {
  hash: string;
  oldestTzktOperation: Pick<TzktOperation, 'timestamp' | 'level' | 'id'>;
}

export interface TezosPreActivity {
  hash: string;
  oldestTzktOperation: TzktOperation;
  /** ISO date string */
  addedAt: string;
  status: TezosPreActivityStatus;
  /** Sorted old-to-new */
  operations: TezosPreActivityOperation[];
  chainId: string;
}

export interface TezosPreActivityOperationBase extends Pick<TzktOperation, 'id' | 'level'> {
  sender: OperationMember;
  contract?: string;
  tokenId?: string;
  status: TezosPreActivityStatus;
  amountSigned: string;
  /** ISO date string */
  addedAt: string;
}

export interface TezosPreActivityTransactionOperation extends TezosPreActivityOperationBase {
  type: 'transaction';
  subtype?: 'transfer' | 'approve';
  from: OperationMember;
  /** Optional - parser is not keeping all of `txs`'s `to_`s, reducing to the total amount */
  to: OperationMember[];
  destination: OperationMember;
  entrypoint?: string;
}

export interface TezosPreActivityOtherOperation extends TezosPreActivityOperationBase {
  type: Exclude<TzktOperationType, 'transaction'>;
  destination?: OperationMember;
}

export type TezosPreActivityOperation = TezosPreActivityTransactionOperation | TezosPreActivityOtherOperation;
