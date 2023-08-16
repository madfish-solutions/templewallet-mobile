import { BigNumber } from 'bignumber.js';
export interface ActivityAmount {
  symbol: string;
  isPositive: boolean;
  exchangeRate: number;
  parsedAmount: BigNumber;
  fiatAmount: BigNumber | undefined;
}
