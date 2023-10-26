import { BigNumber } from 'bignumber.js';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { ActivityGroup } from '../interfaces/activity.interface';
import { useUsdToTokenRates } from '../store/currency/currency-selectors';
import { loadTokenMetadataActions } from '../store/tokens-metadata/tokens-metadata-actions';
import { getTokenSlug } from '../token/utils/token.utils';
import { isDefined } from '../utils/is-defined';
import { isString } from '../utils/is-string';
import { mutezToTz } from '../utils/tezos.util';

import { useTokenMetadataGetter } from './use-token-metadata-getter.hook';

export const useNonZeroAmounts = (group: ActivityGroup) => {
  const dispatch = useDispatch();
  const getTokenMetadata = useTokenMetadataGetter();
  const exchangeRates = useUsdToTokenRates();

  return useMemo(() => {
    const amounts = [];
    let positiveAmountSum = new BigNumber(0);
    let negativeAmountSum = new BigNumber(0);

    for (const { address, tokenId, amount } of group) {
      const slug = getTokenSlug({ address, id: tokenId });
      const { decimals, symbol, name } = getTokenMetadata(slug);
      const exchangeRate: number | undefined = exchangeRates[slug];
      if (isString(address) && !isString(name)) {
        dispatch(loadTokenMetadataActions.submit({ address, id: Number(tokenId ?? '0') }));
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
