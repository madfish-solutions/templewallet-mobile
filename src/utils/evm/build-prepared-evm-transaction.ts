import { SendTransactionRequest } from 'viem';

import { EvmSubmissionFees } from './estimate-evm-transaction';
import { ParsedEvmRpcTransactionRequest } from './parse-rpc-transaction-request';

/**
 * Builds a viem `sendTransaction` payload from a WalletConnect/RPC-parsed request,
 * applying wallet-selected gas and fees (dApp fee fields are discarded).
 *
 * Casts to {@link SendTransactionRequest}: viem's fee/type discriminant union is
 * impractical to construct field-by-field across legacy, EIP-1559, 2930, and 7702.
 */
export const buildPreparedEvmTransaction = (
  parsed: ParsedEvmRpcTransactionRequest,
  { gasLimit, fees }: EvmSubmissionFees
): SendTransactionRequest => {
  const { to, value, data, nonce } = parsed;
  const accessList = 'accessList' in parsed ? parsed.accessList : undefined;
  const base = { to, value, data, nonce, accessList, gas: gasLimit };

  if ('type' in parsed && parsed.type === 'eip7702') {
    // eslint-disable-next-line no-type-assertion/no-type-assertion
    return {
      ...base,
      type: 'eip7702',
      authorizationList: parsed.authorizationList,
      ...(fees.type === 'eip1559'
        ? { maxFeePerGas: fees.maxFeePerGas, maxPriorityFeePerGas: fees.maxPriorityFeePerGas }
        : { maxFeePerGas: fees.gasPrice, maxPriorityFeePerGas: 0n })
    } as SendTransactionRequest;
  }

  if ('type' in parsed && parsed.type === 'eip2930') {
    // eslint-disable-next-line no-type-assertion/no-type-assertion
    return {
      ...base,
      type: 'eip2930',
      gasPrice: fees.type === 'legacy' ? fees.gasPrice : fees.maxFeePerGas
    } as SendTransactionRequest;
  }

  // eslint-disable-next-line no-type-assertion/no-type-assertion
  return {
    ...base,
    ...fees
  } as SendTransactionRequest;
};
