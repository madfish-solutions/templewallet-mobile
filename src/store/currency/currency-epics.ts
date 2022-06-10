import { combineEpics } from 'redux-observable';
import { forkJoin, map, Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { loadUsdToTokenRates$, loadFiatToTezosRates$ } from '../../utils/exchange-rate.util';
import { loadExchangeRates } from './currency-actions';

export const loadExchangeRatesEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadExchangeRates.submit),
    switchMap(() =>
      forkJoin([loadUsdToTokenRates$, loadFiatToTezosRates$]).pipe(
        map(([usdToTokenRates, fiatToTezosRates]) => loadExchangeRates.success({ usdToTokenRates, fiatToTezosRates })),
        catchError(error => of(loadExchangeRates.fail(error.message)))
      )
    )
  );

export const currencyEpics = combineEpics(loadExchangeRatesEpic);
