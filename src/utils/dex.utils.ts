import { BigNumber } from 'bignumber.js';

export const findLpToTokenOutput = (
  inputLpTokenAmount: BigNumber,
  lpTokenTotalSupply: BigNumber,
  outputTokenPool: BigNumber
) => inputLpTokenAmount.multipliedBy(outputTokenPool).dividedToIntegerBy(lpTokenTotalSupply);

export const findTokenToLpInput = (
  outputTokenAmount: BigNumber,
  outputTokenPool: BigNumber,
  lpTokenTotalSupply: BigNumber
) => outputTokenAmount.multipliedBy(lpTokenTotalSupply).dividedToIntegerBy(outputTokenPool).plus(1);

export const findExchangeRate = (aTokenPool: BigNumber, bTokenPool: BigNumber) => aTokenPool.dividedBy(bTokenPool);

export const findTokenInput = (aTokenAmount: BigNumber, aTokenPool: BigNumber, bTokenPool: BigNumber) =>
  aTokenAmount.multipliedBy(bTokenPool).dividedToIntegerBy(aTokenPool).plus(1);

export const findLpTokenAmount = (
  inputTokenAmount: BigNumber,
  inputTokenPool: BigNumber,
  lpTokenTotalSupply: BigNumber
): BigNumber => inputTokenAmount.multipliedBy(lpTokenTotalSupply).dividedToIntegerBy(inputTokenPool);
