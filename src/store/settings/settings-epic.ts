import { combineEpics } from 'redux-observable';
import { EMPTY, Observable } from 'rxjs';
import { catchError, mapTo, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { Shelter } from '../../shelter/shelter';
import { disableBiometryPassword, setIsBiometricsEnabled, setIsBalanceHidden } from './settings-actions';

const disableBiometryPasswordEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(disableBiometryPassword),
    switchMap(() =>
      Shelter.disableBiometryPassword$().pipe(
        mapTo(setIsBiometricsEnabled(false)),
        catchError(() => EMPTY)
      )
    )
  );

const hideBalanceEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(setIsBalanceHidden),
    toPayload(),
    switchMap(payload => mapTo(() => setIsBalanceHidden(payload))),
    catchError(() => EMPTY)
  );

export const settingsEpic = combineEpics(disableBiometryPasswordEpic, hideBalanceEpic);
