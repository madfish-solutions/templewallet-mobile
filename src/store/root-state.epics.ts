import { combineEpics, Epic } from 'redux-observable';
import { EMPTY, forkJoin, Observable, of } from 'rxjs';
import { catchError, concatMap, filter, map, mapTo, switchMap, withLatestFrom } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { globalNavigationRef } from '../navigator/root-stack';
import { Shelter } from '../shelter/shelter';
import { resetBeacon$ } from '../utils/beacon.utils';
import { resetKeychain$ } from '../utils/keychain.utils';
import { RootState } from './create-store';
import { resetApplicationAction, resetKeychainOnInstallAction, untypedNavigateAction } from './root-state.actions';

const resetKeychainOnInstallEpic: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(resetKeychainOnInstallAction.submit),
    withLatestFrom(state$, (_, state) => state.settings.isFirstAppLaunch),
    filter(isFirstAppLaunch => isFirstAppLaunch === true),
    switchMap(() => resetKeychain$()),
    mapTo(resetKeychainOnInstallAction.success()),
    catchError(err => of(resetKeychainOnInstallAction.fail(err.message)))
  );

const resetApplicationEpic = (action$: Observable<Action>) => {
  return action$.pipe(
    ofType(resetApplicationAction.submit),
    switchMap(() => forkJoin([resetKeychain$(), resetBeacon$()])),
    map(() => {
      Shelter.lockApp();

      return resetApplicationAction.success();
    }),
    catchError(err => of(resetApplicationAction.fail(err.message)))
  );
};

const navigateEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(untypedNavigateAction),
    toPayload(),
    concatMap(navigationArgs => {
      // @ts-ignore
      globalNavigationRef.current?.navigate(...navigationArgs);

      return EMPTY;
    })
  );

export const rootStateEpics = combineEpics(resetApplicationEpic, navigateEpic, resetKeychainOnInstallEpic);
