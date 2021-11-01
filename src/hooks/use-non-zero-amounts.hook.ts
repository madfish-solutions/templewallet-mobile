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
    let positiveAmountSum = 0;
    let negativeAmountSum = 0;

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
        //todo rewrite using BigNumber
        const summand = parsedAmount.toNumber() * exchangeRate;
        if (isPositive) {
          positiveAmountSum += summand;
        } else {
          negativeAmountSum += summand;
        }
      }

      if (!parsedAmount.isEqualTo(0)) {
        amounts.push({
          parsedAmount,
          isPositive,
          symbol,
          exchangeRate
        });

        if (amounts.length === 2 && amounts[0].isPositive) {
          [amounts[0], amounts[1]] = [amounts[1], amounts[0]];
        }
      }
    }

    return { amounts, dollarSums: [negativeAmountSum, positiveAmountSum].filter(sum => sum !== 0) };
  }, [group, getTokenMetadata, exchangeRates]);
};
