import { combineEpics, Epic, StateObservable } from 'redux-observable';
import { from, Observable, of } from 'rxjs';
import { catchError, concatMap, map, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { showErrorToast } from '../../toast/toast.utils';
import { AnalyticsEventCategory } from '../../utils/analytics/analytics-event.enum';
import { segmentClient } from '../../utils/analytics/analytics.util';
import { loadExolixCurrencies, loadExolixExchangeData, submitExolixExchange } from '../../utils/exolix.util';
import { withSelectedIsAnalyticsEnabled, withSelectedUserId } from '../../utils/security.utils';
import { RootState } from '../create-store';
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
            segmentClient.track(AnalyticsEventCategory.General, {
              userId,
              event: 'SubmitExolixExchangeError',
              timestamp: new Date().getTime(),
              properties: {
                event: 'SubmitExolixExchangeError',
                category: AnalyticsEventCategory.General,
                message: err.message
              }
            });

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
