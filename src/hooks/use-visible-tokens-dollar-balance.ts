import { BigNumber } from 'bignumber.js';
import { useEffect, useState } from 'react';

import { useExchangeRatesSelector } from '../store/currency/currency-selectors';
import { useVisibleTokensListSelector, useTezosTokenSelector } from '../store/wallet/wallet-selectors';
import { getTokenSlug } from '../token/utils/token.utils';
import { formatAssetAmount } from '../utils/number.util';
import { mutezToTz } from '../utils/tezos.util';

export const useVisibleTokensDollarBalance = () => {
  const [summaryDollarValue, setSummearyDollarValue] = useState(0);
  const exchangeRates = useExchangeRatesSelector();
  const visibleTokens = useVisibleTokensListSelector();
  const tezosToken = useTezosTokenSelector();

  useEffect(() => {
    let dollarVal = 0;
    for (const token of visibleTokens) {
      const exchangeRate: number | undefined = exchangeRates[getTokenSlug(token)];
      const parsedAmount = mutezToTz(new BigNumber(token.balance), token.decimals).multipliedBy(exchangeRate);
      dollarVal += Number(formatAssetAmount(parsedAmount, BigNumber.ROUND_DOWN, 2));
    }
    const tezosParsedAmount = mutezToTz(new BigNumber(tezosToken.balance), tezosToken.decimals).multipliedBy(
      exchangeRates.tez
    );
    dollarVal += Number(formatAssetAmount(tezosParsedAmount, BigNumber.ROUND_DOWN, 2));
    setSummearyDollarValue(dollarVal);
  }, [visibleTokens, exchangeRates]);

  return summaryDollarValue;
};
