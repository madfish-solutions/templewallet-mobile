import { combineEpics } from 'redux-observable';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { templeWalletApi } from '../../api.service';
import { TokenExchangeRateInterface } from '../../interfaces/token-exchange-rate.interface';
import { loadExchangeRates, loadTezosExchangeRate } from './currency-actions';
import { TokenExchangeRateRecord } from './currency-state';

export const loadExchangeRatesEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadExchangeRates.submit),
    switchMap(() =>
      from(templeWalletApi.get<TokenExchangeRateInterface[]>('exchange-rates')).pipe(
        map(({ data }) => {
          const mappedRates: TokenExchangeRateRecord = {};
          for (const { tokenAddress, exchangeRate } of data) {
            mappedRates[tokenAddress] = Number(exchangeRate);
          }

          return loadExchangeRates.success(mappedRates);
        }),
        catchError(err => of(loadExchangeRates.fail(err.message)))
      )
    )
  );

export const loadTezosExchangeRateEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadTezosExchangeRate.submit),
    switchMap(() =>
      from(templeWalletApi.get<number>('exchange-rates/tez')).pipe(
        map(({ data }) => loadTezosExchangeRate.success(data)),
        catchError(err => of(loadExchangeRates.fail(err.message)))
      )
    )
  );

export const currencyEpics = combineEpics(loadExchangeRatesEpic, loadTezosExchangeRateEpic);
