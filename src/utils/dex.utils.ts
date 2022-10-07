import { BigNumber } from 'bignumber.js';

import { mutezToTz } from './tezos.util';

export const findLpToTokenOutput = (
  inputLpTokenAmount: BigNumber,
  lpTokenTotalSupply: BigNumber,
  outputTokenPool: BigNumber
) => {
  const r = inputLpTokenAmount.multipliedBy(outputTokenPool).dividedToIntegerBy(lpTokenTotalSupply);

  // console.log(outputTokenPool, lpTokenTotalSupply, inputLpTokenAmount);

  return r;
};

export const findTokenToLpInput = (
  outputTokenAmount: BigNumber,
  outputTokenPool: BigNumber,
  lpTokenTotalSupply: BigNumber
) => outputTokenAmount.multipliedBy(lpTokenTotalSupply).dividedToIntegerBy(outputTokenPool).plus(1);

export const findExchangeRate = (
  aTokenPool: BigNumber,
  aTokenDecimals: number,
  bTokenPool: BigNumber,
  bTokenDecimals: number
) => mutezToTz(aTokenPool, aTokenDecimals).dividedBy(mutezToTz(bTokenPool, bTokenDecimals));

export const findTokenInput = (aTokenAmount: BigNumber, aTokenPool: BigNumber, bTokenPool: BigNumber) =>
  aTokenAmount.multipliedBy(bTokenPool).dividedToIntegerBy(aTokenPool).plus(1);

export const findLpTokenAmount = (
  inputTokenAmount: BigNumber,
  inputTokenPool: BigNumber,
  lpTokenTotalSupply: BigNumber
): BigNumber => inputTokenAmount.multipliedBy(lpTokenTotalSupply).dividedToIntegerBy(inputTokenPool);
