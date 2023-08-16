import { TokenDelta } from '@temple-wallet/transactions-parser';
import { BigNumber } from 'bignumber.js';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { ActivityAmount } from 'src/interfaces/non-zero-amounts.interface';
import { useFiatToUsdRateSelector } from 'src/store/settings/settings-selectors';

import { useUsdToTokenRates } from '../store/currency/currency-selectors';
import { loadTokenMetadataActions } from '../store/tokens-metadata/tokens-metadata-actions';
import { isDefined } from '../utils/is-defined';
import { isString } from '../utils/is-string';
import { isCollectible, mutezToTz } from '../utils/tezos.util';
import { useTokenMetadataGetter } from './use-token-metadata-getter.hook';

const calculateFiatAmount = (
  parsedAmount: BigNumber,
  exchangeRate: number | undefined,
  fiatToUsdRate: number | undefined
) => {
  if (isDefined(exchangeRate) && isDefined(fiatToUsdRate)) {
    return parsedAmount.absoluteValue().multipliedBy(exchangeRate).multipliedBy(fiatToUsdRate);
  }
};

export const useNonZeroAmounts = (tokensDeltas: Array<TokenDelta>): Array<ActivityAmount> => {
  const dispatch = useDispatch();
  const getTokenMetadata = useTokenMetadataGetter();
  const exchangeRates = useUsdToTokenRates();
  const fiatToUsdRate = useFiatToUsdRateSelector();

  return useMemo(() => {
    const amounts: Array<ActivityAmount> = [];

    for (const { atomicAmount, tokenSlug } of tokensDeltas) {
      const metadata = getTokenMetadata(tokenSlug);
      const { decimals, symbol, name } = metadata;
      const [address, tokenId] = tokenSlug.split('_');
      const exchangeRate: number | undefined = exchangeRates[tokenSlug];

      if (isString(address) && !isString(name)) {
        dispatch(loadTokenMetadataActions.submit({ address, id: Number(tokenId ?? '0') }));
      }

      const parsedAmount = mutezToTz(atomicAmount, decimals);
      const isPositive = parsedAmount.isPositive();

      if (!parsedAmount.isEqualTo(0)) {
        amounts.push({
          isPositive,
          parsedAmount,
          exchangeRate,
          symbol: isCollectible(metadata) ? name : symbol,
          fiatAmount: calculateFiatAmount(parsedAmount, exchangeRate, fiatToUsdRate)
        });
      }
    }

    return amounts;
  }, [tokensDeltas, getTokenMetadata, exchangeRates]);
};
