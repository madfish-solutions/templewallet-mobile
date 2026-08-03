import { formatEther, parseEther } from 'viem';

export const NETWORK_FEE_STEP = 1e-6;

const NETWORK_FEE_RANGE = 2e-4;

export const getGasPriceForNetworkFee = (networkFee: number, gasLimit: bigint) => {
  const feeInWei = parseEther(networkFee.toFixed(6));

  return (feeInWei + gasLimit - 1n) / gasLimit;
};

export const formatNetworkFee = (fee: bigint) => Number(formatEther(fee)).toFixed(6);

export const getNetworkFeeSliderValues = (estimatedFee?: bigint, fee?: bigint) => {
  if (!estimatedFee) {
    return {
      minimumValue: 0,
      maximumValue: NETWORK_FEE_RANGE,
      value: fee ? Number(formatNetworkFee(fee)) : 0
    };
  }

  const estimatedFeeValue = Number(formatNetworkFee(estimatedFee));
  const feeValue = fee ? Number(formatNetworkFee(fee)) : undefined;
  const minimumValue = Math.min(Math.max(estimatedFeeValue - NETWORK_FEE_RANGE / 2, 0), feeValue ?? Infinity);
  const maximumValue = Math.max(estimatedFeeValue + NETWORK_FEE_RANGE / 2, feeValue ?? -Infinity);

  return {
    minimumValue,
    maximumValue,
    value: feeValue ?? minimumValue
  };
};
