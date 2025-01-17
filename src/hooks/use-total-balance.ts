import { BigNumber } from 'bignumber.js';
import { useMemo } from 'react';
import { Alert } from 'react-native';

import { useUsdToTokenRates } from 'src/store/currency/currency-selectors';
import { useCurrentAccountTokens } from 'src/utils/assets/hooks';
import { isDefined } from 'src/utils/is-defined';

import { TEZ_TOKEN_METADATA } from '../token/data/tokens-metadata';
import { getTokenSlug } from '../token/utils/token.utils';
import { getDollarValue } from '../utils/balance.utils';
import { tzToMutez } from '../utils/tezos.util';
import { useTezosToken, useTezosTokenOfCurrentAccount } from '../utils/wallet.utils';

export const useTotalBalance = () => {
  const exchangeRates = useUsdToTokenRates();
  const visibleTokens = useCurrentAccountTokens(true);
  const tezosToken = useTezosTokenOfCurrentAccount();

  const totalBalance = useMemo(() => {
    let dollarValue = new BigNumber(0);
    let alertShown = false;

    for (const token of visibleTokens) {
      const exchangeRate = exchangeRates[getTokenSlug(token)];

      if (!isDefined(token.decimals) || !isDefined(exchangeRate)) {
        continue;
      }

      try {
        const tokenDollarValue = getDollarValue(token.balance, token.decimals, exchangeRate);
        dollarValue = dollarValue.plus(tokenDollarValue);
        if (!dollarValue.isFinite() && !alertShown) {
          Alert.alert('Something fucked up', JSON.stringify({ token, exchangeRate }));
          alertShown = true;
        }
      } catch (e) {
        if (!alertShown) {
          Alert.alert('Total balance calculation error', JSON.stringify({ token, exchangeRate }));
          alertShown = true;
        }
      }
    }

    const tezosDollarValue = getDollarValue(tezosToken.balance, tezosToken.decimals, exchangeRates.tez);
    dollarValue = dollarValue.plus(tezosDollarValue);

    return tzToMutez(dollarValue.dividedBy(exchangeRates.tez), TEZ_TOKEN_METADATA.decimals);
  }, [tezosToken, visibleTokens, exchangeRates]);

  return useTezosToken(totalBalance.toFixed());
};
