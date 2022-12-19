import { combineEpics, Epic } from 'redux-observable';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { fetchMarketCoinsSlugs, fetchMarketTopCoins } from '../../utils/market.util';
import { loadMarketCoinsSlugsActions, loadMarketTopCoinsActions } from './market-actions';

const loadMarketTopCoins$ = () => from(fetchMarketTopCoins());
const loadMarketCoinsSlugs$ = () => from(fetchMarketCoinsSlugs());

const loadMarketTopCoins = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadMarketTopCoinsActions.submit),
    switchMap(() =>
      loadMarketTopCoins$().pipe(
        map(value => loadMarketTopCoinsActions.success(value)),
        catchError(error => of(loadMarketTopCoinsActions.fail(error.message)))
      )
    )
  );

const loadMarketCoinsSlugs: Epic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadMarketCoinsSlugsActions.submit),
    switchMap(() =>
      loadMarketCoinsSlugs$().pipe(
        map(value => loadMarketCoinsSlugsActions.success(value)),
        catchError(error => of(loadMarketCoinsSlugsActions.fail(error.message)))
      )
    )
  );

export const marketEpics = combineEpics(loadMarketTopCoins, loadMarketCoinsSlugs);
