import { TokenDelta } from '@temple-wallet/transactions-parser';
import { BigNumber } from 'bignumber.js';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { useFiatToUsdRateSelector } from 'src/store/settings/settings-selectors';

import { useUsdToTokenRates } from '../store/currency/currency-selectors';
import { loadTokenMetadataActions } from '../store/tokens-metadata/tokens-metadata-actions';
import { isDefined } from '../utils/is-defined';
import { isString } from '../utils/is-string';
import { mutezToTz } from '../utils/tezos.util';
import { useTokenMetadataGetter } from './use-token-metadata-getter.hook';

interface ActivityAmount {
  symbol: string;
  isPositive: boolean;
  exchangeRate: number;
  parsedAmount: BigNumber;
}

interface ActivityNonZeroAmounts {
  amounts: Array<ActivityAmount>;
  dollarSums: Array<BigNumber>;
}

export const useNonZeroAmounts = (tokensDeltas: Array<TokenDelta>): ActivityNonZeroAmounts => {
  const dispatch = useDispatch();
  const getTokenMetadata = useTokenMetadataGetter();
  const exchangeRates = useUsdToTokenRates();
  const fiatToUsdRate = useFiatToUsdRateSelector();

  return useMemo(() => {
    const amounts = [];
    let positiveAmountSum = new BigNumber(0);
    let negativeAmountSum = new BigNumber(0);

    for (const { atomicAmount, tokenSlug } of tokensDeltas) {
      const { decimals, symbol, name, artifactUri } = getTokenMetadata(tokenSlug);
      const [address, tokenId] = tokenSlug.split('_');
      const exchangeRate: number | undefined = exchangeRates[tokenSlug];
      if (isString(address) && !isString(name)) {
        dispatch(loadTokenMetadataActions.submit({ address, id: Number(tokenId ?? '0') }));
      }

      const parsedAmount = mutezToTz(atomicAmount, decimals);
      const isPositive = parsedAmount.isPositive();

      if (isDefined(exchangeRate) && isDefined(fiatToUsdRate)) {
        const summand = parsedAmount.multipliedBy(exchangeRate).multipliedBy(fiatToUsdRate);
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
          symbol: isDefined(artifactUri) ? name : symbol,
          exchangeRate
        });
      }
    }

    return { amounts, dollarSums: [negativeAmountSum, positiveAmountSum].filter(sum => !sum.isZero()) };
  }, [tokensDeltas, getTokenMetadata, exchangeRates]);
};
