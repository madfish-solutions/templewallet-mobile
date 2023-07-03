import { BigNumber } from 'bignumber.js';

export const estimateLiquidityBakingAPY = (xtzPool: BigNumber) => {
  let xtzPool_ = new BigNumber(0);
  try {
    xtzPool_ = new BigNumber(xtzPool);
  } catch (err) {
    return null;
  }

  const annualSubsidy = new BigNumber(2.5 * 2 * 60 * 24 * 365 * 1000000);

  return xtzPool_.plus(annualSubsidy).div(xtzPool_).minus(1).div(2).times(100);
};
