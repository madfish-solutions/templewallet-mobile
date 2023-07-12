import { BigNumber } from 'bignumber.js';

interface LiquidityBakingStorage {
  tokenPool: BigNumber;
  xtzPool: BigNumber;
  lqtTotal: BigNumber;
}

export const liquidityBakingStorageInitialValue: LiquidityBakingStorage = {
  tokenPool: new BigNumber(0),
  xtzPool: new BigNumber(0),
  lqtTotal: new BigNumber(0)
};
