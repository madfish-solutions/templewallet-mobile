import { BigNumber } from 'bignumber.js';

import { TokenInterface } from '../token/interfaces/token.interface';
import { mutezToTz } from './tezos.util';

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

export const findExchangeRate = (
  aToken: TokenInterface,
  aTokenPool: BigNumber,
  bToken: TokenInterface,
  bTokenPool: BigNumber
) => mutezToTz(aTokenPool, aToken.decimals).dividedBy(mutezToTz(bTokenPool, bToken.decimals));

export const findTokenInput = (exchangeRate: BigNumber, tokenAmount: BigNumber) =>
  exchangeRate.multipliedBy(tokenAmount);

export const findLpTokenAmount = (xtzAmountIn: BigNumber, lqtTotal: BigNumber, xtzPool: BigNumber) =>
  new BigNumber(xtzAmountIn).times(lqtTotal).idiv(xtzPool);
