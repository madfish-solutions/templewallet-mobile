import { BigNumber } from 'bignumber.js';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { ActivityGroup } from '../interfaces/activity.interface';
import { useExchangeRatesSelector } from '../store/currency/currency-selectors';
import { loadTokenMetadataActions } from '../store/wallet/wallet-actions';
import { getTokenSlug } from '../token/utils/token.utils';
import { isDefined } from '../utils/is-defined';
import { isString } from '../utils/is-string';
import { mutezToTz } from '../utils/tezos.util';
import { useTokenMetadataGetter } from './use-token-metadata-getter.hook';

export const useNonZeroAmounts = (group: ActivityGroup) => {
  const dispatch = useDispatch();
  const getTokenMetadata = useTokenMetadataGetter();
  const exchangeRates = useExchangeRatesSelector();

  return useMemo(() => {
    const amounts = [];
    let positiveAmountSum = new BigNumber(0);
    let negativeAmountSum = new BigNumber(0);

    for (const { address, id, amount } of group) {
      const slug = getTokenSlug({ address, id });
      const { decimals, symbol, name } = getTokenMetadata(slug);
      const exchangeRate: number | undefined = exchangeRates[slug];
      if (isString(address) && !isString(name)) {
        dispatch(loadTokenMetadataActions.submit({ address, id: id ?? 0 }));
      }

      const parsedAmount = mutezToTz(new BigNumber(amount), decimals);
      const isPositive = parsedAmount.isPositive();

      if (isDefined(exchangeRate)) {
        const summand = parsedAmount.multipliedBy(exchangeRate);
        if (isPositive) {
          positiveAmountSum = positiveAmountSum.plus(summand);
        } else {
          negativeAmountSum = negativeAmountSum.plus(summand);
        }
      }

      if (!parsedAmount.isEqualTo(0)) {
        amounts.push({
          parsedAmount,
          isPositive,
          symbol,
          exchangeRate
        });
      }
    }

    return { amounts, dollarSums: [negativeAmountSum, positiveAmountSum].filter(sum => !sum.isZero()) };
  }, [group, getTokenMetadata, exchangeRates]);
};
