import Keychain from 'react-native-keychain';
import { combineEpics } from 'redux-observable';
import { EMPTY, forkJoin, from, Observable } from 'rxjs';
import { concatMap, filter, mapTo, switchMap, withLatestFrom } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { BeaconHandler } from '../beacon/beacon-handler';
import { globalNavigationRef } from '../navigator/root-stack';
import { isDefined } from '../utils/is-defined';
import { getKeychainOptions } from '../utils/keychain.utils';
import { RootState } from './create-store';
import { reinstallAction, rootStateResetAction, untypedNavigateAction } from './root-state.actions';

const reinstallEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(reinstallAction.submit),
    withLatestFrom(state$, (_, state) => state.settings.isReinstalled),
    switchMap(async isReinstalled => isDefined(isReinstalled) || isReinstalled === true),
    filter(x => !!x),
    mapTo(rootStateResetAction.submit())
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
