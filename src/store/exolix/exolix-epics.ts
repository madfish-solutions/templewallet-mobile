import { combineEpics, Epic, StateObservable } from 'redux-observable';
import { from, Observable, of } from 'rxjs';
import { catchError, concatMap, map, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { showErrorToast } from 'src/toast/toast.utils';
import { sendAnalyticsEvent } from 'src/utils/analytics/analytics.util';
import { loadExolixCurrencies, loadExolixExchangeData, submitExolixExchange } from 'src/utils/exolix.util';
import { withSelectedIsAnalyticsEnabled, withSelectedUserId } from 'src/utils/security.utils';

import type { RootState } from '../types';
import {
  loadExolixCurrenciesAction,
  loadExolixExchangeDataActions,
  refreshExolixExchangeDataAction,
  setExolixStepAction
} from './exolix-actions';

const loadExolixCurrenciesEpic: Epic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadExolixCurrenciesAction.submit),
    switchMap(() =>
      from(loadExolixCurrencies()).pipe(
        map(currencies => loadExolixCurrenciesAction.success(currencies)),
        catchError(() => of(loadExolixCurrenciesAction.fail()))
      )
    )
  );

const refreshExolixExchangeDataEpic: Epic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(refreshExolixExchangeDataAction),
    toPayload(),
    switchMap(id =>
      from(loadExolixExchangeData(id)).pipe(
        map(({ data: exchangeData }) => loadExolixExchangeDataActions.success(exchangeData)),
        catchError(() => of(loadExolixExchangeDataActions.fail()))
      )
    )
  );

const loadExolixExchangeDataEpic: Epic = (action$: Observable<Action>, state$: StateObservable<RootState>) =>
  action$.pipe(
    ofType(loadExolixExchangeDataActions.submit),
    toPayload(),
    withSelectedUserId(state$),
    withSelectedIsAnalyticsEnabled(state$),
    switchMap(([[requestPayload, userId], isAnalyticsEnabled]) =>
      from(submitExolixExchange(requestPayload)).pipe(
        map(({ data }) => data),
        concatMap(exchangeData => [loadExolixExchangeDataActions.success(exchangeData), setExolixStepAction(1)]),
        catchError(err => {
          isAnalyticsEnabled &&
            sendAnalyticsEvent('SubmitExolixExchangeError', undefined, { userId }, { message: err.message });

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
