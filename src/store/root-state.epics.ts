import { StackActions } from '@react-navigation/native';
import { combineEpics, Epic } from 'redux-observable';
import { EMPTY, forkJoin, Observable, of } from 'rxjs';
import { catchError, concatMap, filter, map, mapTo, switchMap, withLatestFrom } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { ModalParams, ModalsEnum } from 'src/navigator/enums/modals.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { MainStackParams, StacksEnum } from 'src/navigator/enums/stacks.enum';
import { globalNavigationRef } from 'src/navigator/global-nav-ref';
import { isInModalsStack } from 'src/navigator/hooks/use-navigation.hook';
import { Shelter } from 'src/shelter/shelter';
import { resetBeacon$ } from 'src/utils/beacon.utils';
import { resetKeychain$ } from 'src/utils/keychain.utils';

import {
  resetApplicationAction,
  resetKeychainOnInstallAction,
  navigateAction,
  navigateBackAction
} from './root-state.actions';
import type { NavigationActionParams, RootState } from './types';

const resetKeychainOnInstallEpic: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(resetKeychainOnInstallAction.submit),
    withLatestFrom(state$, (_, state) => state.settings.isFirstAppLaunch),
    filter(isFirstAppLaunch => isFirstAppLaunch === true),
    switchMap(() => resetKeychain$()),
    mapTo(resetKeychainOnInstallAction.success()),
    catchError(err => of(resetKeychainOnInstallAction.fail(err.message)))
  );

const resetApplicationSubmitEpic = (action$: Observable<Action>) => {
  return action$.pipe(
    ofType(resetApplicationAction.submit),
    switchMap(() => forkJoin([resetKeychain$(), resetBeacon$()])),
    map(() => resetApplicationAction.success()),
    catchError(err => of(resetApplicationAction.fail(err.message)))
  );
};

const resetApplicationSuccessEpic = (action$: Observable<Action>) => {
  return action$.pipe(
    ofType(resetApplicationAction.success),
    concatMap(() => {
      Shelter.lockApp();

      return EMPTY;
    }),
    catchError(err => of(resetApplicationAction.fail(err.message)))
  );
};

const isNavigationToModal = (navigationParams: NavigationActionParams): navigationParams is ModalParams =>
  navigationParams.screen in ModalsEnum;
const isNavigationToScreen = (navigationParams: NavigationActionParams): navigationParams is MainStackParams =>
  navigationParams.screen in ScreensEnum;

const navigateEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(navigateAction),
    toPayload(),
    concatMap(navigationParams => {
      if (isInModalsStack(globalNavigationRef.current?.getState()) && !isNavigationToModal(navigationParams)) {
        globalNavigationRef.current?.dispatch(StackActions.popToTop());
      }

      if (isNavigationToScreen(navigationParams)) {
        globalNavigationRef.current?.navigate(StacksEnum.MainStack, navigationParams);
      } else {
        // @ts-expect-error
        globalNavigationRef.current?.navigate(navigationParams.screen, navigationParams.params);
      }

      return EMPTY;
    })
  );

const navigateBackEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(navigateBackAction),
    concatMap(() => {
      globalNavigationRef.current?.goBack();

      return EMPTY;
    })
  );

export const rootStateEpics = combineEpics(
  resetApplicationSubmitEpic,
  resetApplicationSuccessEpic,
  navigateEpic,
  navigateBackEpic,
  resetKeychainOnInstallEpic
);
