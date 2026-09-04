import { FeeValuesEIP1559, FeeValuesLegacy } from 'viem';

import { EvmTransactionRequest } from 'src/interfaces/evm-transaction-request.interface';
import { isDefined } from 'src/utils/is-defined';

interface PreparedEvmTransaction {
  type: string;
  gas: bigint;
  gasPrice?: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
}

type EstimatePrepareRequest = Pick<EvmTransactionRequest, 'to' | 'value' | 'data'> & { account: HexString };

export interface EvmTransactionPreparer {
  prepareTransactionRequest: (request: EstimatePrepareRequest) => Promise<PreparedEvmTransaction>;
}

export interface LegacyFees extends FeeValuesLegacy {
  type: 'legacy';
}

export interface Eip1559Fees extends FeeValuesEIP1559 {
  type: 'eip1559';
}

export type EvmFees = LegacyFees | Eip1559Fees;

export interface EvmSubmissionFees {
  gasLimit: bigint;
  fees: EvmFees;
}

interface EstimationBase {
  gas: bigint;
  estimatedFee: bigint;
}

export type LegacyEstimation = LegacyFees & EstimationBase;
export type Eip1559Estimation = Eip1559Fees & EstimationBase;
export type EvmEstimation = LegacyEstimation | Eip1559Estimation;

export const estimateEvmTransaction = async (
  publicClient: EvmTransactionPreparer,
  account: HexString,
  request: EvmTransactionRequest
): Promise<EvmEstimation> => {
  const prepareRequest = {
    account,
    to: request.to,
    value: request.value,
    data: request.data,
    ...(isDefined(request.type) ? { type: request.type } : {}),
    ...(isDefined(request.accessList) ? { accessList: request.accessList } : {}),
    ...(isDefined(request.authorizationList) ? { authorizationList: request.authorizationList } : {})
  };
  // viem discriminates prepare args by `type`; our request union is not assignable to that.
  // eslint-disable-next-line no-type-assertion/no-type-assertion
  const prepared = await publicClient.prepareTransactionRequest(prepareRequest as EstimatePrepareRequest);

  return toEvmEstimation(prepared);
};

const toEvmEstimation = (prepared: PreparedEvmTransaction): EvmEstimation => {
  const { type, gas } = prepared;

  if (gas <= 0n) {
    throw new Error('Invalid EVM gas estimation');
  }

  switch (type) {
    case 'legacy':
    case 'eip2930': {
      const { gasPrice } = prepared;

      if (!gasPrice || gasPrice <= 0n) {
        throw new Error('Invalid legacy fee estimation');
      }

      return {
        type: 'legacy',
        gas,
        gasPrice,
        estimatedFee: gas * gasPrice
      };
    }
    case 'eip1559':
    case 'eip7702': {
      const { maxFeePerGas, maxPriorityFeePerGas } = prepared;

      if (!maxFeePerGas || maxPriorityFeePerGas === undefined || maxPriorityFeePerGas > maxFeePerGas) {
        throw new Error('Invalid EIP-1559 fee estimation');
      }

      return {
        type: 'eip1559',
        gas,
        maxFeePerGas,
        maxPriorityFeePerGas,
        estimatedFee: gas * maxFeePerGas
      };
    }
    default:
      throw new Error(`Unsupported EVM transaction type: ${type}`);
  }
};
