import { BigNumber } from 'bignumber.js';
import { useMemo } from 'react';

import { useUsdToTokenRates } from '../store/currency/currency-selectors';
import { useVisibleTokensListSelector } from '../store/wallet/wallet-selectors';
import { TEZ_TOKEN_METADATA } from '../token/data/tokens-metadata';
import { getTokenSlug } from '../token/utils/token.utils';
import { getDollarValue } from '../utils/balance.utils';
import { tzToMutez } from '../utils/tezos.util';
import { useTezosToken, useTezosTokenOfCurrentAccount } from '../utils/wallet.utils';

export const useTotalBalance = () => {
  const exchangeRates = useUsdToTokenRates();
  const visibleTokens = useVisibleTokensListSelector();
  const tezosToken = useTezosTokenOfCurrentAccount();

  const totalBalance = useMemo(() => {
    let dollarValue = new BigNumber(0);

    for (const token of visibleTokens) {
      const exchangeRate = exchangeRates[getTokenSlug(token)];
      const tokenDollarValue = getDollarValue(token.balance, token, exchangeRate);
      dollarValue = dollarValue.plus(tokenDollarValue);
    }

    const tezosDollarValue = getDollarValue(tezosToken.balance, tezosToken, exchangeRates.tez);
    dollarValue = dollarValue.plus(tezosDollarValue);

    return tzToMutez(dollarValue.dividedBy(exchangeRates.tez), TEZ_TOKEN_METADATA.decimals);
  }, [tezosToken, visibleTokens, exchangeRates]);

  return useTezosToken(totalBalance.toFixed());
};
