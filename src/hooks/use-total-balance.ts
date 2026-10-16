import { BigNumber } from 'bignumber.js';
import { useMemo } from 'react';

import { VisibilityEnum } from 'src/enums/visibility.enum';
import { Account } from 'src/interfaces/account.interfaces';
import { useUsdToTokenRates } from 'src/store/currency/currency-selectors';
import { useEvmAccountChainBalancesSelector } from 'src/store/evm/balances/evm-balances-selectors';
import { useEvmChainExchangeRatesSelector } from 'src/store/evm/exchange-rates/evm-exchange-rates-selectors';
import { useEvmChainTokensMetadataSelector } from 'src/store/evm/tokens-metadata/evm-tokens-metadata-selectors';
import { useFiatToUsdRateSelector } from 'src/store/settings/settings-selectors';
import { useTokensMetadataSelector } from 'src/store/tokens-metadata/tokens-metadata-selectors';
import {
  useAccountAddressForEvm,
  useStoredTokensOfKnownAccountSelector,
  useTezosBalanceOfKnownAccountSelector
} from 'src/store/wallet/wallet-selectors';
import { getAccountAddressForEvm } from 'src/utils/account.utils';
import { useCurrentAccountTokens } from 'src/utils/assets/hooks';
import { isEvmCollectibleSlug } from 'src/utils/from-token-slug';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

import { TEZ_TOKEN_DECIMALS } from '../token/data/tokens-metadata';
import { getTokenSlug } from '../token/utils/token.utils';
import { getDollarValue } from '../utils/balance.utils';
import { ZERO } from '../utils/number.util';
import { useTezosTokenOfCurrentAccount } from '../utils/wallet.utils';

const useEvmDollarBalance = (evmAddress: HexString | undefined) => {
  const balances = useEvmAccountChainBalancesSelector(evmAddress, ETHERLINK_MAINNET_CHAIN_ID);
  const metadata = useEvmChainTokensMetadataSelector(ETHERLINK_MAINNET_CHAIN_ID);
  const exchangeRates = useEvmChainExchangeRatesSelector(ETHERLINK_MAINNET_CHAIN_ID);

  return useMemo(() => {
    let dollarValue = new BigNumber(0);

    for (const slug in balances) {
      if (isEvmCollectibleSlug(slug)) {
        continue;
      }

      const usdRate = exchangeRates[slug];
      const decimals = metadata[slug]?.decimals;
      if (usdRate == null || decimals == null) {
        continue;
      }

      dollarValue = dollarValue.plus(getDollarValue(balances[slug], decimals, usdRate));
    }

    return dollarValue;
  }, [balances, metadata, exchangeRates]);
};

/** Total value of the current account's visible assets across all chains, in USD */
export const useTotalBalance = () => {
  const exchangeRates = useUsdToTokenRates();
  const visibleTokens = useCurrentAccountTokens(true);
  const tezosToken = useTezosTokenOfCurrentAccount();

  const evmAddress = useAccountAddressForEvm();
  const evmDollarBalance = useEvmDollarBalance(evmAddress);

  return useMemo(() => {
    let dollarValue = new BigNumber(0);

    for (const token of visibleTokens) {
      const exchangeRate = exchangeRates[getTokenSlug(token)];

      dollarValue = dollarValue.plus(getDollarValue(token.balance, token.decimals, exchangeRate));
    }

    const tezosDollarValue = getDollarValue(tezosToken.balance, tezosToken.decimals, exchangeRates.tez);

    return dollarValue.plus(tezosDollarValue).plus(evmDollarBalance);
  }, [tezosToken, visibleTokens, exchangeRates, evmDollarBalance]);
};

export const useTotalFiatBalanceOfAccount = (account: Account) => {
  const exchangeRates = useUsdToTokenRates();
  const metadatas = useTokensMetadataSelector();
  const tezosBalance = useTezosBalanceOfKnownAccountSelector(account.id);
  const storedTokens = useStoredTokensOfKnownAccountSelector(account.id);
  const fiatToUsdRate = useFiatToUsdRateSelector();

  const evmDollarBalance = useEvmDollarBalance(getAccountAddressForEvm(account));

  return useMemo(() => {
    if (fiatToUsdRate == null) {
      return ZERO;
    }

    let dollarValue = getDollarValue(tezosBalance, TEZ_TOKEN_DECIMALS, exchangeRates.tez);

    for (const token of storedTokens) {
      if (token.visibility !== VisibilityEnum.Visible) {
        continue;
      }

      const decimals = metadatas[token.slug]?.decimals;
      const exchangeRate = exchangeRates[token.slug];
      if (decimals == null || exchangeRate == null) {
        continue;
      }

      dollarValue = dollarValue.plus(getDollarValue(token.balance, decimals, exchangeRate));
    }

    return dollarValue.plus(evmDollarBalance).times(fiatToUsdRate);
  }, [tezosBalance, storedTokens, metadatas, exchangeRates, evmDollarBalance, fiatToUsdRate]);
};
