import { FeeValuesEIP1559, FeeValuesLegacy } from 'viem';

import { EvmTransferRequest } from 'src/utils/evm/build-evm-transfer-request';

interface PreparedEvmTransaction {
  type: string;
  gas: bigint;
  gasPrice?: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
}

export interface EvmTransactionPreparer {
  prepareTransactionRequest: (request: EvmTransferRequest & { account: HexString }) => Promise<PreparedEvmTransaction>;
}

export interface LegacyFees extends FeeValuesLegacy {
  type: 'legacy';
}

export interface Eip1559Fees extends FeeValuesEIP1559 {
  type: 'eip1559';
}

export type EvmFees = LegacyFees | Eip1559Fees;

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
  request: EvmTransferRequest
): Promise<EvmEstimation> => {
  const transaction = await publicClient.prepareTransactionRequest({ ...request, account });

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
