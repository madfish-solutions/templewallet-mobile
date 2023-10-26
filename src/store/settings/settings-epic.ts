import { combineEpics } from 'redux-observable';
import { EMPTY, Observable } from 'rxjs';
import { catchError, debounceTime, mapTo, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { Shelter } from '../../shelter/shelter';

import {
  disableBiometryPassword,
  hideLoaderAction,
  setIsBiometricsEnabled,
  setIsShowLoaderAction,
  showLoaderAction
} from './settings-actions';

const LOADER_HIDE_DEBOUNCE_TIME = 300;

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

const showLoaderEpic = (action$: Observable<Action>) =>
  action$.pipe(ofType(showLoaderAction), mapTo(setIsShowLoaderAction(true)));

const hideLoaderEpic = (action$: Observable<Action>) =>
  action$.pipe(ofType(hideLoaderAction), debounceTime(LOADER_HIDE_DEBOUNCE_TIME), mapTo(setIsShowLoaderAction(false)));

export const settingsEpic = combineEpics(disableBiometryPasswordEpic, showLoaderEpic, hideLoaderEpic);
