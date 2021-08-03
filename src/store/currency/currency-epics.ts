import { combineEpics } from 'redux-observable';
import { from, Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { templeWalletApi } from '../../api.service';
import { ExchangeRateInterface } from '../../interfaces/token-exchange-rate.interface';
import { TEZ_TOKEN_METADATA } from '../../token/data/tokens-metadata';
import { getTokenSlug } from '../../token/utils/token.utils';
import { isString } from '../../utils/is-string';
import { loadExchangeRates } from './currency-actions';
import { ExchangeRateRecord } from './currency-state';

export const loadExchangeRatesEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadExchangeRates.submit),
    switchMap(() =>
      from(templeWalletApi.get<ExchangeRateInterface[]>('exchange-rates')).pipe(
        switchMap(({ data }) => {
          const mappedRates: ExchangeRateRecord = {};
          for (const { tokenAddress, tokenId, exchangeRate } of data) {
            const tokenSlug = getTokenSlug({ address: tokenAddress, id: tokenId ?? 0 });
            mappedRates[isString(tokenSlug) ? tokenSlug : TEZ_TOKEN_METADATA.name] = Number(exchangeRate);
          }

          return [loadExchangeRates.success(mappedRates)];
        }),
        catchError(err => of(loadExchangeRates.fail(err.message)))
      )
    )
  );

export const currencyEpics = combineEpics(loadExchangeRatesEpic);
