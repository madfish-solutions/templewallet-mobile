import { BigNumber } from 'bignumber.js';
import { useMemo } from 'react';

import { useFiatToUsdRateSelector } from 'src/store/settings/settings-selectors';
import { mutezToTz } from 'src/utils/tezos.util';

const DEFAULT_AMOUNT = 0;
const DEFAULT_EXCHANGE_RATE = 1;

export const useAmounts = (atomicAmount: string | nullish, decimals: number, exchangeRate: string | nullish) => {
  const fiatToUsdRate = useFiatToUsdRateSelector();

  const amount = useMemo(
    () => mutezToTz(new BigNumber(atomicAmount ?? DEFAULT_AMOUNT), decimals),
    [atomicAmount, decimals]
  );
  const fiatEquivalent = useMemo(
    () =>
      amount.multipliedBy(exchangeRate ?? DEFAULT_EXCHANGE_RATE).multipliedBy(fiatToUsdRate ?? DEFAULT_EXCHANGE_RATE),
    [amount, exchangeRate, fiatToUsdRate]
  );

  return { amount, fiatEquivalent };
};
