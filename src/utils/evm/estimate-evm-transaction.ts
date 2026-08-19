import { FeeValuesEIP1559, FeeValuesLegacy } from 'viem';

import { EvmTransactionRequest } from 'src/interfaces/evm-transaction-request.interface';

interface PreparedEvmTransaction {
  type: string;
  gas: bigint;
  gasPrice?: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
}

export interface EvmTransactionPreparer {
  prepareTransactionRequest: (
    request: Pick<EvmTransactionRequest, 'to' | 'value' | 'data' | 'gas'> & { account: HexString }
  ) => Promise<PreparedEvmTransaction>;
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
  // Fee fields from a dApp must not drive prepare — otherwise network fee options collapse to the
  // dApp suggestion. Gas limit may still be forwarded as a dApp-provided cap/hint.
  const {
    gasPrice: _gasPrice,
    maxFeePerGas: _maxFeePerGas,
    maxPriorityFeePerGas: _maxPriorityFeePerGas,
    ...rest
  } = request;
  const transaction = await publicClient.prepareTransactionRequest({ ...rest, account });

  if (transaction.gas <= 0n) {
    throw new Error('Invalid EVM gas estimation');
  }

  switch (transaction.type) {
    case 'legacy': {
      if (!transaction.gasPrice || transaction.gasPrice <= 0n) {
        throw new Error('Invalid legacy fee estimation');
      }

      return {
        type: 'legacy',
        gas: transaction.gas,
        gasPrice: transaction.gasPrice,
        estimatedFee: transaction.gas * transaction.gasPrice
      };
    }
    case 'eip1559': {
      const { gas, maxFeePerGas, maxPriorityFeePerGas } = transaction;

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
      throw new Error(`Unsupported EVM transaction type: ${transaction.type}`);
  }
};
