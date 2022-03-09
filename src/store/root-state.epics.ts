import Keychain from 'react-native-keychain';
import { combineEpics } from 'redux-observable';
import { EMPTY, forkJoin, from, Observable } from 'rxjs';
import { concatMap, filter, mapTo, switchMap, withLatestFrom } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { BeaconHandler } from '../beacon/beacon-handler';
import { globalNavigationRef } from '../navigator/root-stack';
import { getKeychainOptions } from '../utils/keychain.utils';
import { RootState } from './create-store';
import { isFirstAppLaunchCheckAction, rootStateResetAction, untypedNavigateAction } from './root-state.actions';
import { setIsReinstalled } from './settings/settings-actions';

const reinstallEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(isFirstAppLaunchCheckAction.submit),
    withLatestFrom(state$, (_, state) => state.settings.isFirstAppLaunch),
    filter(isFirstAppLaunch => isFirstAppLaunch !== true),
    mapTo(setIsReinstalled.success())
  );

const rootStateResetEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(rootStateResetAction.submit),
    withLatestFrom(state$, (_, state) =>
      state.wallet.accounts.map(({ publicKeyHash }) => getKeychainOptions(publicKeyHash))
    ),
    switchMap(keychainOptionsArray =>
      from(keychainOptionsArray).pipe(switchMap(options => Keychain.resetGenericPassword(options)))
    ),
    switchMap(() => forkJoin([BeaconHandler.removeAllPermissions(), BeaconHandler.removeAllPeers()])),
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

export const rootStateEpics = combineEpics(rootStateResetEpic, navigateEpic, reinstallEpic);
