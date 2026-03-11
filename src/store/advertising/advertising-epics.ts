import { combineEpics } from 'redux-observable';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { templeWalletApi } from 'src/api.service';
import { GetAdvertisingInfoResponse } from 'src/interfaces/advertising-promotion.interface';

import { loadAdvertisingPromotionActions } from './advertising-actions';

const loadActivePromotionEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadAdvertisingPromotionActions.submit),
    switchMap(() =>
      from(templeWalletApi.get<GetAdvertisingInfoResponse>('/advertising-info')).pipe(
        map(response => loadAdvertisingPromotionActions.success(response.data.data)),
        catchError(err => of(loadAdvertisingPromotionActions.fail(err.message)))
      )
    )
  );

export const advertisingEpics = combineEpics(loadActivePromotionEpic);
