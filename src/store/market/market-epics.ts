import { combineEpics, Epic } from 'redux-observable';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { loadMarketCoinsSlugs$, loadMarketTopCoins$ } from '../../utils/market.util';
import { loadMarketCoinsSlugsActions, loadMarketTopCoinsActions } from './market-actions';

const loadMarketTopCoins = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadMarketTopCoinsActions.submit),
    switchMap(() =>
      loadMarketTopCoins$.pipe(
        map(value => loadMarketTopCoinsActions.success(value)),
        catchError(error => of(loadMarketTopCoinsActions.fail(error.message)))
      )
    )
  );

const loadMarketCoinsSlugs: Epic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadMarketCoinsSlugsActions.submit),
    switchMap(() =>
      loadMarketCoinsSlugs$.pipe(
        map(value => loadMarketCoinsSlugsActions.success(value)),
        catchError(error => of(loadMarketCoinsSlugsActions.fail(error.message)))
      )
    )
  );

export const marketEpics = combineEpics(loadMarketTopCoins, loadMarketCoinsSlugs);
