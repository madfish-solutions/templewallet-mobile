import { combineEpics } from 'redux-observable';
import { EMPTY, forkJoin, Observable } from 'rxjs';
import { catchError, mapTo, switchMap, filter } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { Shelter } from '../../shelter/shelter';
import { resetBeacon$ } from '../../utils/beacon.utils';
import { resetKeychain$ } from '../../utils/keychain.utils';
import {
  disableBiometryPassword,
  setIsBiometricsEnabled,
  setIsPasscode,
  setPasscodeDisabled
} from './settings-actions';

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

const disableDevicePasscodeEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(setIsPasscode),
    filter(x => Boolean(x) === false),
    switchMap(() => forkJoin([resetKeychain$(), resetBeacon$()])),
    mapTo(setPasscodeDisabled(true))
  );

export const settingsEpic = combineEpics(disableBiometryPasswordEpic, disableDevicePasscodeEpic);
