import { BigNumber } from 'bignumber.js';

import { mutezToTz } from './tezos.util';

export const getDollarValue = (balance: string, decimals: number, exchangeRate = 0) => {
  const dollarValue = mutezToTz(new BigNumber(balance), decimals).multipliedBy(exchangeRate);

  return dollarValue.isNaN() ? new BigNumber(0) : dollarValue;
};
