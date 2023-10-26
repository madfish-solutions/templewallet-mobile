import { combineEpics, Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { getOptimalPromotion } from 'src/utils/optimal.utils';
import { withSelectedAccount } from 'src/utils/wallet.utils';

import { RootState } from '../types';
import { loadPartnersPromoActions } from './partners-promotion-actions';

const loadPartnersPromotionEpic: Epic<Action, Action, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(loadPartnersPromoActions.submit),
    toPayload(),
    withSelectedAccount(state$),
    switchMap(([payload, account]) =>
      from(getOptimalPromotion(payload, account.publicKeyHash)).pipe(
        map(optimalPromotion => loadPartnersPromoActions.success(optimalPromotion)),
        catchError(error => of(loadPartnersPromoActions.fail(error.message)))
      )
    )
  );

export const partnersPromotionEpics = combineEpics(loadPartnersPromotionEpic);
