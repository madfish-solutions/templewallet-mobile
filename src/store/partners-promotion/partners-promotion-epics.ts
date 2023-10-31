import { combineEpics, Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { getOptimalPromotion, OptimalPromotionAdType } from 'src/utils/optimal.utils';
import { withSelectedAccount } from 'src/utils/wallet.utils';

import { RootState } from '../types';
import { loadPartnersPromoActions, loadPartnersTextPromoActions } from './partners-promotion-actions';

const loadPartnersPromotionEpic: Epic<Action, Action, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(loadPartnersPromoActions.submit),
    withSelectedAccount(state$),
    switchMap(([, account]) =>
      from(getOptimalPromotion(OptimalPromotionAdType.TwMobile, account.publicKeyHash)).pipe(
        map(optimalPromotion => loadPartnersPromoActions.success(optimalPromotion)),
        catchError(error => of(loadPartnersPromoActions.fail(error.message)))
      )
    )
  );

const loadPartnersTextPromotionEpic: Epic<Action, Action, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(loadPartnersTextPromoActions.submit),
    withSelectedAccount(state$),
    switchMap(([, account]) =>
      from(getOptimalPromotion(OptimalPromotionAdType.TwToken, account.publicKeyHash)).pipe(
        map(optimalPromotion => loadPartnersTextPromoActions.success(optimalPromotion)),
        catchError(error => of(loadPartnersTextPromoActions.fail(error.message)))
      )
    )
  );

export const partnersPromotionEpics = combineEpics(loadPartnersPromotionEpic, loadPartnersTextPromotionEpic);
