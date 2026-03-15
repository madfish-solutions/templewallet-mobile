import BigNumber from 'bignumber.js';

interface ParametersSaplingTransaction {
  to: string;
  amount: number;
  memo?: string;
  mutez?: boolean;
}

type ParametersUnshieldedTransaction = Omit<ParametersSaplingTransaction, 'memo'>;

type SaplingContractTransactionType = 'shielded' | 'unshielded' | 'sapling';

interface SaplingContractTransactionBase {
  type: SaplingContractTransactionType;
}

interface SaplingUnshieldedTransaction extends SaplingContractTransactionBase {
  type: 'unshielded';
  params: ParametersUnshieldedTransaction;
}

interface SaplingOtherTransaction extends SaplingContractTransactionBase {
  type: 'shielded' | 'sapling';
  params: ParametersSaplingTransaction[];
}

export type SaplingContractTransaction = SaplingUnshieldedTransaction | SaplingOtherTransaction;

export interface SaplingIncomingTransaction {
  value: BigNumber;
  memo: string;
  paymentAddress: string;
  isSpent: boolean;
}
export interface SaplingOutgoingTransaction {
  value: BigNumber;
  memo: string;
  paymentAddress: string;
}
