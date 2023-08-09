import { BigNumber } from 'bignumber.js';

export interface LiquidityBakingStorage {
  tokenPool: BigNumber;
  xtzPool: BigNumber;
  lqtTotal: BigNumber;
}
