import { BigNumber } from 'bignumber.js';

import { NetworkEnum } from './types';

export const quipuswapStakingBaseUrls = {
  [NetworkEnum.Mainnet]: 'https://staking-api-mainnet.prod.quipuswap.com',
  [NetworkEnum.Ghostnet]: 'https://staking-api-ghostnet.prod.quipuswap.com'
};

export const precision = new BigNumber(10).pow(18);
export const aPrecision = new BigNumber(100);
export const accumPrecision = new BigNumber(1e10);
export const feeDenominator = new BigNumber(1e10);
