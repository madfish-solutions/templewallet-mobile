import { BigNumber } from 'bignumber.js';

export const findLpToTokenOutput = (
  inputLpTokenAmount: BigNumber,
  lpTokenTotalSupply: BigNumber,
  outputTokenPool: BigNumber
) => inputLpTokenAmount.multipliedBy(outputTokenPool).dividedToIntegerBy(lpTokenTotalSupply);

export const findTokenToLpInput = (
  outputTokenAmount: BigNumber,
  lpTokenTotalSupply: BigNumber,
  outputTokenPool: BigNumber
) => outputTokenAmount.multipliedBy(lpTokenTotalSupply).dividedToIntegerBy(outputTokenPool);

export const findExchangeRate = (aTokenPool: BigNumber, bTokenPool: BigNumber) => aTokenPool.dividedBy(bTokenPool);

export const findTokenInput = (exchangeRate: BigNumber, tokenAmount: BigNumber) =>
  exchangeRate.multipliedBy(tokenAmount);

export const findLpTokenAmount = (xtzAmountIn: BigNumber, lqtTotal: BigNumber, xtzPool: BigNumber): BigNumber =>
  xtzAmountIn.multipliedBy(lqtTotal).dividedToIntegerBy(xtzPool);
