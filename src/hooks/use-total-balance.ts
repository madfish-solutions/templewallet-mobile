import { BigNumber } from 'bignumber.js';
import { useEffect, useState } from 'react';

import { useExchangeRatesSelector } from '../store/currency/currency-selectors';
import {
  useVisibleTokensListSelector,
  useTezosTokenSelector,
  useSelectedAccountSelector
} from '../store/wallet/wallet-selectors';
import { TEZ_TOKEN_METADATA } from '../token/data/tokens-metadata';
import { getTokenSlug } from '../token/utils/token.utils';
import { mutezToTz, tzToMutez } from '../utils/tezos.util';

export const useTotalBalance = () => {
  const [totalBalance, setTotalBalance] = useState(new BigNumber(0));
  const exchangeRates = useExchangeRatesSelector();
  const visibleTokens = useVisibleTokensListSelector();
  const tezosToken = useTezosTokenSelector();
  const selectedAccount = useSelectedAccountSelector();

  useEffect(() => {
    let dollarValue = new BigNumber(0);
    for (const token of visibleTokens) {
      const exchangeRate: number | undefined = exchangeRates[getTokenSlug(token)];
      const parsedAmount = mutezToTz(new BigNumber(token.balance), token.decimals).multipliedBy(exchangeRate);
      dollarValue = dollarValue.plus(parsedAmount);
    }
    const tezosParsedAmount = mutezToTz(new BigNumber(tezosToken.balance), tezosToken.decimals).multipliedBy(
      exchangeRates.tez
    );
    dollarValue = dollarValue.plus(tezosParsedAmount);
    setTotalBalance(tzToMutez(dollarValue.dividedBy(exchangeRates.tez), TEZ_TOKEN_METADATA.decimals));
  }, [visibleTokens, exchangeRates, selectedAccount]);

  return { totalBalance, summaryAsset: TEZ_TOKEN_METADATA };
};
