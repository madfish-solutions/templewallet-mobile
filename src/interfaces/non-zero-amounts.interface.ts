import BigNumber from 'bignumber.js';

export interface NonZeroAmounts {
  amounts: {
    parsedAmount: BigNumber;
    isPositive: boolean;
    symbol: string;
    exchangeRate: number;
  }[];
  dollarSums: BigNumber[];
}
