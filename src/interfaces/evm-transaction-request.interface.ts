/**
 * EVM transaction fields used for local estimation / submission.
 * Omitting `to` represents contract creation (origination).
 * Optional `gas` / fee fields may be supplied by a connected dApp.
 */
export interface EvmTransactionRequest {
  to?: HexString;
  value: bigint;
  data?: HexString;
  gas?: bigint;
  gasPrice?: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
}
