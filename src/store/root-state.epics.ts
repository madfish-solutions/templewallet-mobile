import Keychain from 'react-native-keychain';
import { combineEpics } from 'redux-observable';
import { EMPTY, forkJoin, Observable, of } from 'rxjs';
import { catchError, concatMap, filter, mapTo, switchMap, withLatestFrom } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { BeaconHandler } from '../beacon/beacon-handler';
import { globalNavigationRef } from '../navigator/root-stack';
import { RootState } from './create-store';
import { isFirstAppLaunchCheckAction, rootStateResetAction, untypedNavigateAction } from './root-state.actions';
import { setIsReinstalled } from './settings/settings-actions';

const isFirstLaunchCheckEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(isFirstAppLaunchCheckAction.submit),
    withLatestFrom(state$, (_, state) => state.settings.isFirstAppLaunch),
    filter(isFirstAppLaunch => isFirstAppLaunch === true),
    concatMap(() => [rootStateResetAction.submit(), setIsReinstalled.success()])
  );

const rootStateResetEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(rootStateResetAction.submit),
    switchMap(() => Keychain.getAllGenericPasswordServices()),
    switchMap(keychainServicesArray =>
      forkJoin(keychainServicesArray.map(service => Keychain.resetGenericPassword({ service })))
    ),
    switchMap(() =>
      forkJoin([BeaconHandler.removeAllPermissions(), BeaconHandler.removeAllPeers()]).pipe(
        catchError(() => of(undefined))
      )
    ),
    mapTo(rootStateResetAction.success())
  );

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

export const rootStateEpics = combineEpics(rootStateResetEpic, navigateEpic, isFirstLaunchCheckEpic);
