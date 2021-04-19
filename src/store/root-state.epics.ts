import Keychain from 'react-native-keychain';
import { combineEpics } from 'redux-observable';
import { from, Observable } from 'rxjs';
import { map, mapTo, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { APP_IDENTIFIER } from '../shelter/shelter';
import { keychainResetSuccessAction, rootStateResetAction } from './root-state.actions';

const rootStateResetEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(rootStateResetAction),
    switchMap(() => Keychain.getAllGenericPasswordServices()),
    map(services => services.filter(service => service.startsWith(APP_IDENTIFIER))),
    switchMap(services => from(services).pipe(switchMap(service => Keychain.resetGenericPassword({ service })))),
    mapTo(keychainResetSuccessAction())
  );

export const rootStateEpics = combineEpics(rootStateResetEpic);
