import { BigNumber } from 'bignumber.js';
import { formatEther, parseEther } from 'viem';

import { EvmTransactionRequest } from 'src/interfaces/evm-transaction-request.interface';
import {
  Eip1559Estimation,
  Eip1559Fees,
  EvmEstimation,
  EvmFees,
  LegacyEstimation,
  LegacyFees
} from 'src/utils/evm/estimate-evm-transaction';
import { isDefined } from 'src/utils/is-defined';

const NETWORK_FEE_STEP = 1e-6;

const FEE_PERCENTAGE_BASE = 100n;
const SLOW_FEE_PERCENTAGE = 90n;
const FAST_FEE_PERCENTAGE = 110n;

interface Eip1559FeeOption extends Eip1559Fees {
  fee: bigint;
}

interface LegacyFeeOption extends LegacyFees {
  fee: bigint;
}

const ceilDivide = (dividend: bigint, divisor: bigint): bigint => (dividend + divisor - 1n) / divisor;

const multiplyByPercentage = (value: bigint, percentage: bigint) => ceilDivide(value * percentage, FEE_PERCENTAGE_BASE);

const getEvmFeesForGasPrice = (gasPrice: bigint, estimation: EvmEstimation): EvmFees => {
  if (estimation.type === 'legacy') return { type: 'legacy', gasPrice };

  return getEip1559FeesForMaxFee(gasPrice, estimation);
};

/** Prefer request-provided EIP-1559 priority fee when present; otherwise scale from the estimate. */
export const resolveEvmSubmissionFees = (
  gasPrice: bigint,
  estimation: EvmEstimation,
  request?: EvmTransactionRequest
): EvmFees => {
  if (estimation.type === 'legacy') {
    return { type: 'legacy', gasPrice };
  }

  const providedPriorityFee = request?.maxPriorityFeePerGas;

  if (isDefined(providedPriorityFee)) {
    return {
      type: 'eip1559',
      maxFeePerGas: gasPrice,
      maxPriorityFeePerGas: providedPriorityFee < gasPrice ? providedPriorityFee : gasPrice
    };
  }

  return getEvmFeesForGasPrice(gasPrice, estimation);
};

const getEip1559FeesForMaxFee = (maxFeePerGas: bigint, estimation: Eip1559Estimation): Eip1559Fees => {
  const scaledPriorityFee =
    estimation.maxFeePerGas === 0n
      ? 0n
      : ceilDivide(estimation.maxPriorityFeePerGas * maxFeePerGas, estimation.maxFeePerGas);

  return {
    type: 'eip1559',
    maxFeePerGas,
    maxPriorityFeePerGas: scaledPriorityFee < maxFeePerGas ? scaledPriorityFee : maxFeePerGas
  };
};

const makeFeeOption = (maxFeePerGas: bigint, estimation: Eip1559Estimation): Eip1559FeeOption => ({
  ...getEip1559FeesForMaxFee(maxFeePerGas, estimation),
  fee: estimation.gas * maxFeePerGas
});

const makeLegacyFeeOption = (gasPrice: bigint, estimation: LegacyEstimation): LegacyFeeOption => ({
  type: 'legacy',
  gasPrice,
  fee: estimation.gas * gasPrice
});

const getEip1559FeeOptions = (estimation: Eip1559Estimation) => {
  const slowMaxFeePerGas = multiplyByPercentage(estimation.maxFeePerGas, SLOW_FEE_PERCENTAGE);
  const fastMaxFeePerGas = multiplyByPercentage(estimation.maxFeePerGas, FAST_FEE_PERCENTAGE);

  return {
    slow: makeFeeOption(slowMaxFeePerGas > 0n ? slowMaxFeePerGas : 1n, estimation),
    mid: makeFeeOption(estimation.maxFeePerGas, estimation),
    fast: makeFeeOption(fastMaxFeePerGas, estimation)
  };
};

export const getEvmFeeOptions = (estimation: EvmEstimation) => {
  if (estimation.type === 'eip1559') return getEip1559FeeOptions(estimation);

  const estimatedGasPrice = estimation.gasPrice;
  const slowGasPrice = multiplyByPercentage(estimatedGasPrice, SLOW_FEE_PERCENTAGE);
  const fastGasPrice = multiplyByPercentage(estimatedGasPrice, FAST_FEE_PERCENTAGE);

  return {
    slow: makeLegacyFeeOption(slowGasPrice > 0n ? slowGasPrice : 1n, estimation),
    mid: makeLegacyFeeOption(estimatedGasPrice, estimation),
    fast: makeLegacyFeeOption(fastGasPrice, estimation)
  };
};

export const getGasPriceForNetworkFee = (networkFee: number, gasLimit: bigint) => {
  const feeInWei = parseEther(networkFee.toFixed(18));

  return ceilDivide(feeInWei, gasLimit);
};

/** Prefer a provided gas limit when present; otherwise use the wallet estimate. */
export const resolveEvmGasLimit = (estimatedGas: bigint, providedGas?: bigint) =>
  isDefined(providedGas) && providedGas > 0n ? providedGas : estimatedGas;

export const formatNetworkFee = (fee: bigint) => {
  const formatted = new BigNumber(formatEther(fee)).decimalPlaces(6).toFixed();

  return fee > 0n && formatted === '0.000000' ? '<0.000001' : formatted;
};

export const getNetworkFeeSliderValues = (slowFee?: bigint, fastFee?: bigint, fee?: bigint) => {
  const slowFeeValue = slowFee ? Number(formatEther(slowFee)) : 0;
  const fastFeeValue = fastFee ? Number(formatEther(fastFee)) : NETWORK_FEE_STEP;
  const feeValue = fee ? Number(formatEther(fee)) : undefined;

  const minimumValue = Math.min(slowFeeValue, feeValue ?? Infinity);
  const maximumValue = Math.max(fastFeeValue, feeValue ?? -Infinity);
  const range = maximumValue - minimumValue;

  return {
    minimumValue,
    maximumValue,
    step: range > 0 ? Math.min(NETWORK_FEE_STEP, range / 20) : NETWORK_FEE_STEP,
    value: feeValue ?? slowFeeValue
  };
};
