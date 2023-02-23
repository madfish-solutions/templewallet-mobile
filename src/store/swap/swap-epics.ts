import { combineEpics, Epic } from 'redux-observable';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { fetchRoute3Tokens, fetchRoute3Dexes$, fetchRoute3SwapParams$ } from 'src/utils/route3.util';

import { loadSwapDexesAction, loadSwapParamsAction, loadSwapTokensAction } from './swap-actions';

const loadSwapTokensEpic: Epic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadSwapTokensAction.submit),
    switchMap(() =>
      fetchRoute3Tokens().pipe(
        map(tokens => loadSwapTokensAction.success(tokens)),
        catchError(err => of(loadSwapTokensAction.fail(err.message)))
      )
    )
  );

const loadSwapParamsEpic: Epic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadSwapParamsAction.submit),
    toPayload(),
    switchMap(payload =>
      fetchRoute3SwapParams$(payload).pipe(
        map(swapParams => loadSwapParamsAction.success(swapParams)),
        catchError(err => of(loadSwapParamsAction.fail(err.message)))
      )
    )
  );

const loadSwapDexesEpic: Epic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadSwapDexesAction.submit),
    switchMap(() =>
      fetchRoute3Dexes$().pipe(
        map(dexes => loadSwapDexesAction.success(dexes)),
        catchError(err => of(loadSwapDexesAction.fail(err.message)))
      )
    )
  );

export const swapEpics = combineEpics(loadSwapTokensEpic, loadSwapParamsEpic, loadSwapDexesEpic);
