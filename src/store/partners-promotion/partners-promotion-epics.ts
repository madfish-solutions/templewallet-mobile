import { combineEpics } from 'redux-observable';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { getOptimalPromotion } from 'src/utils/optimal.utils';

import { loadPartnersPromoActions } from './partners-promotion-actions';

const loadPartnersPromotionEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadPartnersPromoActions.submit),
    switchMap(() =>
      from(getOptimalPromotion()).pipe(
        map(optimalPromotion => loadPartnersPromoActions.success(optimalPromotion)),
        catchError(error => of(loadPartnersPromoActions.fail(error)))
      )
    )
  );

export const partnersPromotionEpics = combineEpics(loadPartnersPromotionEpic);
