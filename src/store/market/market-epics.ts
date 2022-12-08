import { combineEpics } from 'redux-observable';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { loadMarketTopCoins$ } from '../../utils/market.util';
import { loadMarketTopCoinsActions } from './market-actions';

export const loadMarketTopCoins = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadMarketTopCoinsActions.submit),
    switchMap(() =>
      loadMarketTopCoins$.pipe(
        map(value => loadMarketTopCoinsActions.success(value)),
        catchError(error => of(loadMarketTopCoinsActions.fail(error.message)))
      )
    )
  );

export const marketEpics = combineEpics(loadMarketTopCoins);
