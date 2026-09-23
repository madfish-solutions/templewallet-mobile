import { Hash, TransactionReceipt } from 'viem';

export type EvmTransactionSubmissionErrorCode =
  | 'account-unavailable'
  | 'signer-address-mismatch'
  | 'receipt-unavailable'
  | 'transaction-replaced'
  | 'transaction-reverted';

interface EvmTransactionSubmissionErrorContext {
  cause?: unknown;
  transactionHash?: Hash;
  receipt?: TransactionReceipt;
}

export class EvmTransactionSubmissionError extends Error {
  readonly name = 'EvmTransactionSubmissionError';
  readonly cause?: unknown;
  readonly transactionHash?: Hash;
  readonly receipt?: TransactionReceipt;

  constructor(
    readonly code: EvmTransactionSubmissionErrorCode,
    message: string,
    { cause, transactionHash, receipt }: EvmTransactionSubmissionErrorContext = {}
  ) {
    super(message);
    this.cause = cause;
    this.transactionHash = transactionHash;
    this.receipt = receipt;
  }
}
