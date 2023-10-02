import { combineEpics, Epic } from 'redux-observable';
import { catchError, concatMap, from, map, Observable, of, switchMap } from 'rxjs';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import {
  fetchMarketTokensSlugs,
  fetchMarketTokens,
  withTokensIdsToSlugs,
  getMarketTokensIds
} from 'src/utils/market.utils';

import { RootState } from '../types';
import { loadMarketTokensSlugsActions, loadMarketTokensActions } from './market-actions';

const loadMarketTokensSlugs$ = () => from(fetchMarketTokensSlugs());
const loadMarketTokens$ = (ids: string) => from(fetchMarketTokens(ids));

const loadMarketCoinsSlugs: Epic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadMarketTokensSlugsActions.submit),
    switchMap(() =>
      loadMarketTokensSlugs$().pipe(
        concatMap(value => [loadMarketTokensSlugsActions.success(value), loadMarketTokensActions.submit()]),
        catchError(error => of(loadMarketTokensSlugsActions.fail(error.message)))
      )
    )
  );

const loadMarketCoins = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadMarketTokensActions.submit),
    withTokensIdsToSlugs(state$),
    switchMap(([, tokensIdsToSlugs]) =>
      loadMarketTokens$(getMarketTokensIds(tokensIdsToSlugs)).pipe(
        map(value => loadMarketTokensActions.success(value)),
        catchError(error => of(loadMarketTokensActions.fail(error.message)))
      )
    )
  );

export const marketEpics = combineEpics(loadMarketCoinsSlugs, loadMarketCoins);
