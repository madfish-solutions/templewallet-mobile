import { BigNumber } from 'bignumber.js';
export interface ActivityAmount {
  symbol: string;
  isPositive: boolean;
  exchangeRate: number | undefined;
  parsedAmount: BigNumber | undefined;
  fiatAmount: BigNumber | undefined;
}
