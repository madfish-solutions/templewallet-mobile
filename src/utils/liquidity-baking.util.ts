import { BigNumber } from 'bignumber.js';

import { DEFAULT_LIQUIDITY_BAKING_SUBSIDY, DEFAULT_MINIMAL_BLOCK_DELAY } from 'src/apis/liquidity-baking/consts';

import { SECONDS_IN_DAY } from './date.utils';
import { aprToApy } from './earn.utils';

export const estimateLiquidityBakingAPY = (xtzPool: BigNumber) => {
  let xtzPool_ = new BigNumber(0);
  try {
    xtzPool_ = new BigNumber(xtzPool);
  } catch (err) {
    return null;
  }

  const annualSubsidy = DEFAULT_LIQUIDITY_BAKING_SUBSIDY.times(SECONDS_IN_DAY * 365).div(DEFAULT_MINIMAL_BLOCK_DELAY);

  return aprToApy(xtzPool_.plus(annualSubsidy).div(xtzPool_).minus(1).div(2).times(100).toNumber());
};
