import { BigNumber } from 'bignumber.js';

import { isDefined } from './is-defined';
import { ZERO } from './number.util';
import { mutezToTz } from './tezos.util';

export const getDollarValue = (
  balance: string | nullish,
  decimals: number | nullish,
  exchangeRate: number | nullish
) => {
  const dollarValue =
    isDefined(balance) && isDefined(decimals) && isDefined(exchangeRate)
      ? mutezToTz(new BigNumber(balance), decimals).multipliedBy(exchangeRate)
      : ZERO;

  return dollarValue.isNaN() ? ZERO : dollarValue;
};
