import { combineEpics } from 'redux-observable';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { getOptimalPromotion } from 'src/utils/optimal.utils';

import { loadPartnersPromoActions } from './partners-promotion-actions';

const loadPartnersPromotionEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadPartnersPromoActions.submit),
    toPayload(),
    switchMap(payload =>
      from(getOptimalPromotion(payload)).pipe(
        map(optimalPromotion => loadPartnersPromoActions.success(optimalPromotion)),
        catchError(error => of(loadPartnersPromoActions.fail(error.message)))
      )
    )
  );

export const partnersPromotionEpics = combineEpics(loadPartnersPromotionEpic);
