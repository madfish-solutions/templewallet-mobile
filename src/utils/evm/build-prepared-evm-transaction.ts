import { SendTransactionRequest } from 'viem';

import { EvmTransactionRequest } from 'src/interfaces/evm-transaction-request.interface';
import { isDefined } from 'src/utils/is-defined';

import { EvmSubmissionFees } from './estimate-evm-transaction';

/**
 * Builds a viem `sendTransaction` payload, applying wallet-selected gas and fees
 * (request fee fields are discarded). Typed-tx fields (`type`, `accessList`,
 * `authorizationList`) and `nonce` are preserved.
 *
 * Casts to {@link SendTransactionRequest}: viem's fee/type discriminant union is
 * impractical to construct field-by-field across legacy, EIP-1559, 2930, and 7702.
 */
export const buildPreparedEvmTransaction = (
  request: Pick<EvmTransactionRequest, 'to' | 'value' | 'data' | 'type' | 'accessList' | 'authorizationList'> & {
    nonce?: number;
  },
  { gasLimit, fees }: EvmSubmissionFees
): SendTransactionRequest => {
  const { to, value, data, nonce, type, accessList, authorizationList } = request;
  const base = {
    to,
    value,
    data,
    nonce,
    gas: gasLimit,
    ...(isDefined(accessList) ? { accessList } : {})
  };

  if (type === 'eip7702') {
    if (!isDefined(authorizationList)) {
      throw new Error('EIP-7702 transactions require authorizationList');
    }

    return {
      ...base,
      type: 'eip7702',
      authorizationList,
      ...(fees.type === 'eip1559'
        ? { maxFeePerGas: fees.maxFeePerGas, maxPriorityFeePerGas: fees.maxPriorityFeePerGas }
        : { maxFeePerGas: fees.gasPrice, maxPriorityFeePerGas: 0n })
    };
  }

  if (type === 'eip2930') {
    return {
      ...base,
      type: 'eip2930',
      gasPrice: fees.type === 'legacy' ? fees.gasPrice : fees.maxFeePerGas
    };
  }

  // eslint-disable-next-line no-type-assertion/no-type-assertion
  return {
    ...base,
    ...fees
  } as SendTransactionRequest;
};
