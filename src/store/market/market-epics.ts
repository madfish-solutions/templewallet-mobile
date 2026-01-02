import { combineEpics } from 'redux-observable';
import { catchError, concatMap, from, map, of, switchMap } from 'rxjs';
import { ofType } from 'ts-action-operators';

import { sendErrorAnalyticsEvent } from 'src/utils/analytics/analytics.util';
import { withUserAnalyticsCredentials } from 'src/utils/error-analytics-data.utils';
import {
  fetchMarketTokensSlugs,
  fetchMarketTokens,
  withTokensIdsToSlugs,
  getMarketTokensIds
} from 'src/utils/market.utils';

import { AnyActionEpic } from '../types';

import { loadMarketTokensSlugsActions, loadMarketTokensActions } from './market-actions';

const loadMarketTokensSlugs$ = () => from(fetchMarketTokensSlugs());
const loadMarketTokens$ = (ids: string) => from(fetchMarketTokens(ids));

const loadMarketCoinsSlugs: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadMarketTokensSlugsActions.submit),
    withUserAnalyticsCredentials(state$),
    switchMap(([, { isAnalyticsEnabled, userId, ABTestingCategory }]) =>
      loadMarketTokensSlugs$().pipe(
        concatMap(value => [loadMarketTokensSlugsActions.success(value), loadMarketTokensActions.submit()]),
        catchError(error => {
          if (isAnalyticsEnabled) {
            sendErrorAnalyticsEvent('LoadMarketTokensSlugsEpicError', error, [], { userId, ABTestingCategory });
          }

          return of(loadMarketTokensSlugsActions.fail(error.message));
        })
      )
    )
  );

const loadMarketCoins: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadMarketTokensActions.submit),
    withTokensIdsToSlugs(state$),
    withUserAnalyticsCredentials(state$),
    switchMap(([[, tokensIdsToSlugs], { isAnalyticsEnabled, userId, ABTestingCategory }]) =>
      loadMarketTokens$(getMarketTokensIds(tokensIdsToSlugs)).pipe(
        map(value => loadMarketTokensActions.success(value)),
        catchError(error => {
          if (isAnalyticsEnabled) {
            sendErrorAnalyticsEvent(
              'LoadMarketTokensEpicError',
              error,
              [],
              { userId, ABTestingCategory },
              { tokensIdsToSlugs }
            );
          }

          return of(loadMarketTokensActions.fail(error.message));
        })
      )
    )
  );

export const marketEpics = combineEpics(loadMarketCoinsSlugs, loadMarketCoins);
