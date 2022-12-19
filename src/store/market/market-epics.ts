import { combineEpics, Epic } from 'redux-observable';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { fetchMarketTokensSlugs, fetchMarketTopTokens } from '../../utils/market.util';
import { loadMarketTokensSlugsActions, loadMarketTopTokenActions } from './market-actions';

const loadMarketTopTokens$ = () => from(fetchMarketTopTokens());
const loadMarketTokensSlugs$ = () => from(fetchMarketTokensSlugs());

const loadMarketTopCoins = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadMarketTopTokenActions.submit),
    switchMap(() =>
      loadMarketTopTokens$().pipe(
        map(value => loadMarketTopTokenActions.success(value)),
        catchError(error => of(loadMarketTopTokenActions.fail(error.message)))
      )
    )
  );

const loadMarketCoinsSlugs: Epic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadMarketTokensSlugsActions.submit),
    switchMap(() =>
      loadMarketTokensSlugs$().pipe(
        map(value => loadMarketTokensSlugsActions.success(value)),
        catchError(error => of(loadMarketTokensSlugsActions.fail(error.message)))
      )
    )
  );

export const marketEpics = combineEpics(loadMarketTopCoins, loadMarketCoinsSlugs);
