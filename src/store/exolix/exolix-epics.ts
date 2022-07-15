import { combineEpics, Epic } from 'redux-observable';
import { from, Observable, of } from 'rxjs';
import { catchError, concatMap, map, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { loadExolixCurrencies, loadExolixExchangeData, submitExolixExchange } from '../../utils/exolix.util';
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

const loadExolixExchangeDataEpic: Epic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadExolixExchangeDataActions.submit),
    toPayload(),
    switchMap(requestPayload =>
      from(submitExolixExchange(requestPayload)).pipe(
        map(({ data }) => data),
        concatMap(exchangeData => [loadExolixExchangeDataActions.success(exchangeData), setExolixStepAction(1)]),
        catchError(() => of(loadExolixExchangeDataActions.fail()))
      )
    )
  );

export const exolixEpics = combineEpics(
  loadExolixCurrenciesEpic,
  refreshExolixExchangeDataEpic,
  loadExolixExchangeDataEpic
);
