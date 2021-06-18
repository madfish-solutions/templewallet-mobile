import Keychain from 'react-native-keychain';
import { combineEpics } from 'redux-observable';
import { EMPTY, from, Observable } from 'rxjs';
import { concatMap, map, mapTo, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { globalNavigationRef } from '../navigator/root-stack';
import { APP_IDENTIFIER } from '../shelter/shelter';
import { keychainResetSuccessAction, rootStateResetAction, untypedNavigateAction } from './root-state.actions';

const rootStateResetEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(rootStateResetAction),
    switchMap(() => Keychain.getAllGenericPasswordServices()),
    map(services => services.filter(service => service.startsWith(APP_IDENTIFIER))),
    switchMap(services => from(services).pipe(switchMap(service => Keychain.resetGenericPassword({ service })))),
    mapTo(keychainResetSuccessAction())
  );

const navigateEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(untypedNavigateAction),
    toPayload(),
    concatMap(navigationArgs => {
      globalNavigationRef.current?.navigate(...navigationArgs);

      return EMPTY;
    })
  );

export const rootStateEpics = combineEpics(rootStateResetEpic, navigateEpic);
