import { switchMap, from, of } from 'rxjs';

import { templeWalletApi, coingeckoApi } from '../api.service';
import { CoingeckoQuoteInterface } from '../interfaces/coingecko-quote.interface';
import { ExchangeRateInterface } from '../interfaces/token-exchange-rate.interface';
import { ExchangeRateRecord } from '../store/currency/currency-state';
import { getTokenSlug } from '../token/utils/token.utils';

export const loadExchangeRates$ = from(templeWalletApi.get<Array<ExchangeRateInterface>>('/exchange-rates')).pipe(
  switchMap(payload => {
    const data = payload.data;
    const mappedRates: ExchangeRateRecord = {};

    for (const { tokenAddress, tokenId, exchangeRate } of data) {
      mappedRates[getTokenSlug({ address: tokenAddress, id: tokenId })] = +exchangeRate;
    }

    return of(mappedRates);
  })
);

export const loadQuotes$ = from(
  coingeckoApi.get<CoingeckoQuoteInterface>('/simple/price?ids=tezos&vs_currencies=usd,cny,idr,eur,jpy,krw,try')
).pipe(
  switchMap(({ data }) => {
    const mappedRates: ExchangeRateRecord = {};
    const tezosData = Object.keys(data.tezos);

    for (const quote of tezosData) {
      mappedRates[quote] = +data.tezos[quote];
    }

    return of(mappedRates);
  })
);
