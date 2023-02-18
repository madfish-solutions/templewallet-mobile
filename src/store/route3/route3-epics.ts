import { combineEpics, Epic } from 'redux-observable';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { fetchgetRoute3Tokens, fetchRoute3Dexes$, fetchRoute3SwapParams$ } from 'src/utils/route3.util';

import { loadRoute3DexesAction, loadRoute3SwapParamsAction, loadRoute3TokensAction } from './route3-actions';

const loadRoute3TokensEpic: Epic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadRoute3TokensAction.submit),
    switchMap(() =>
      fetchgetRoute3Tokens().pipe(
        map(tokens => loadRoute3TokensAction.success(tokens)),
        catchError(err => of(loadRoute3TokensAction.fail(err.message)))
      )
    )
  );

const loadRoute3SwapParamsEpic: Epic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadRoute3SwapParamsAction.submit),
    toPayload(),
    switchMap(payload =>
      fetchRoute3SwapParams$(payload).pipe(
        map(swapParams => loadRoute3SwapParamsAction.success(swapParams)),
        catchError(err => of(loadRoute3SwapParamsAction.fail(err.message)))
      )
    )
  );

const loadRoute3DexesEpic: Epic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadRoute3DexesAction.submit),
    switchMap(() =>
      fetchRoute3Dexes$().pipe(
        map(dexes => loadRoute3DexesAction.success(dexes)),
        catchError(err => of(loadRoute3DexesAction.fail(err.message)))
      )
    )
  );

export const route3Epics = combineEpics(loadRoute3TokensEpic, loadRoute3SwapParamsEpic, loadRoute3DexesEpic);
