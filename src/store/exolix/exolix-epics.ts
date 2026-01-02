import { combineEpics } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, concatMap, map, switchMap } from 'rxjs/operators';
import { ofType, toPayload } from 'ts-action-operators';

import { showErrorToast } from 'src/toast/toast.utils';
import { sendErrorAnalyticsEvent } from 'src/utils/analytics/analytics.util';
import { AnalyticsError, withUserAnalyticsCredentials } from 'src/utils/error-analytics-data.utils';
import { loadExolixCurrencies, loadExolixExchangeData, submitExolixExchange } from 'src/utils/exolix.util';

import type { AnyActionEpic } from '../types';

import {
  loadExolixCurrenciesAction,
  loadExolixExchangeDataActions,
  refreshExolixExchangeDataAction,
  setExolixStepAction
} from './exolix-actions';

const loadExolixCurrenciesEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadExolixCurrenciesAction.submit),
    withUserAnalyticsCredentials(state$),
    switchMap(([, { isAnalyticsEnabled, ABTestingCategory, userId }]) =>
      from(loadExolixCurrencies()).pipe(
        map(currencies => loadExolixCurrenciesAction.success(currencies)),
        catchError(e => {
          if (isAnalyticsEnabled) {
            sendErrorAnalyticsEvent(
              'LoadExolixCurrenciesEpicError',
              e instanceof AnalyticsError ? e.error : e,
              [],
              { ABTestingCategory, userId },
              e instanceof AnalyticsError ? e.additionalProperties : {}
            );
          }

          return of(loadExolixCurrenciesAction.fail());
        })
      )
    )
  );

const refreshExolixExchangeDataEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(refreshExolixExchangeDataAction),
    toPayload(),
    withUserAnalyticsCredentials(state$),
    switchMap(([id, { userId, ABTestingCategory, isAnalyticsEnabled }]) =>
      from(loadExolixExchangeData(id)).pipe(
        map(({ data: exchangeData }) => loadExolixExchangeDataActions.success(exchangeData)),
        catchError(error => {
          if (isAnalyticsEnabled) {
            sendErrorAnalyticsEvent('RefreshExolixExchangeDataEpicError', error, [], { userId, ABTestingCategory });
          }

          return of(loadExolixExchangeDataActions.fail());
        })
      )
    )
  );

const loadExolixExchangeDataEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadExolixExchangeDataActions.submit),
    toPayload(),
    withUserAnalyticsCredentials(state$),
    switchMap(([requestPayload, { userId, ABTestingCategory, isAnalyticsEnabled }]) =>
      from(submitExolixExchange(requestPayload)).pipe(
        map(({ data }) => data),
        concatMap(exchangeData => [loadExolixExchangeDataActions.success(exchangeData), setExolixStepAction(1)]),
        catchError(err => {
          isAnalyticsEnabled &&
            sendErrorAnalyticsEvent(
              'LoadExolixExchangeDataEpicError',
              err,
              [requestPayload.withdrawalAddress, requestPayload.withdrawalExtraId],
              { userId, ABTestingCategory },
              { requestPayload }
            );

          showErrorToast({ description: 'Ooops, something went wrong' });

          return of(loadExolixExchangeDataActions.fail());
        })
      )
    )
  );

export const exolixEpics = combineEpics(
  loadExolixCurrenciesEpic,
  refreshExolixExchangeDataEpic,
  loadExolixExchangeDataEpic
);
