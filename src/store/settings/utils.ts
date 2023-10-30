import { Draft } from '@reduxjs/toolkit';

import { RpcInterface } from 'src/interfaces/rpc.interface';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { FiatCurrenciesEnum } from 'src/utils/exchange-rate.util';
import { isDefined } from 'src/utils/is-defined';
import { TEMPLE_RPC } from 'src/utils/rpc/rpc-list';

import type { RootState } from '../types';

import { SettingsState } from './settings-state';

export const getFiatToUsdRate = (state: RootState) => {
  const fiatExchangeRates = state.currency.fiatToTezosRates.data;
  const fiatCurrency = state.settings.fiatCurrency;
  const tezUsdExchangeRates = state.currency.usdToTokenRates.data[TEZ_TOKEN_SLUG];

  // Coingecko and Temple Wallet APIs return slightly different TEZ/USD exchange rates
  if (fiatCurrency === FiatCurrenciesEnum.USD) {
    return 1;
  }

  const fiatExchangeRate: number | undefined = fiatExchangeRates[fiatCurrency.toLowerCase()];
  const exchangeRateTezos: number | undefined = tezUsdExchangeRates;

  if (isDefined(fiatExchangeRate) && isDefined(exchangeRateTezos)) {
    return fiatExchangeRate / exchangeRateTezos;
  }

  return undefined;
};

export const alterCustomRPC = (state: Draft<SettingsState>, url: string, values?: RpcInterface) => {
  if (url === TEMPLE_RPC.url) {
    return;
  }

  const list = state.rpcList;
  const index = list.findIndex(rpc => rpc.url === url);

  if (index < 0) {
    return;
  }

  if (values == null) {
    // 'remove' case
    list.splice(index, 1);
    if (state.selectedRpcUrl === url) {
      state.selectedRpcUrl = state.rpcList[0].url;
    }
  } else {
    // 'edit' case
    list.splice(index, 1, values);
    if (url === state.selectedRpcUrl) {
      state.selectedRpcUrl = values.url;
    }
  }
};
