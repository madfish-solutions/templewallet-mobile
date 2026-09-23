import { AccessList, SignedAuthorization } from 'viem';

/**
 * EVM transaction fields used for local estimation / submission.
 * Omitting `to` represents contract creation (origination).
 * Optional `gas` / fee / typed-tx fields may be supplied by a connected dApp.
 */
export type EvmTransactionType = 'legacy' | 'eip2930' | 'eip1559' | 'eip7702';

export interface EvmTransactionRequest {
  to?: HexString;
  value: bigint;
  data?: HexString;
  gas?: bigint;
  gasPrice?: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  type?: EvmTransactionType;
  accessList?: AccessList;
  authorizationList?: SignedAuthorization[];
}
