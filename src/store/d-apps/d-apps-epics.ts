import { BeaconErrorType, BeaconMessageType } from '@airgap/beacon-sdk';
import { combineEpics } from 'redux-observable';
import { EMPTY, from, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { BeaconHandler } from '../../beacon/beacon-handler';
import { StacksEnum } from '../../navigator/enums/stacks.enum';
import { showErrorToast, showSuccessToast } from '../../toast/toast.utils';
import { navigateAction } from '../root-state.actions';
import {
  abortPermissionRequestAction,
  approvePermissionRequestAction,
  loadPermissionsActions,
  removePermissionAction
} from './d-apps-actions';

const loadPermissionsEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadPermissionsActions.submit),
    switchMap(() =>
      from(BeaconHandler.getPermissions()).pipe(
        map(loadPermissionsActions.success),
        catchError(err => of(loadPermissionsActions.fail(err.message)))
      )
    )
  );

const removePermissionEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(removePermissionAction),
    toPayload(),
    switchMap(accountIdentifier =>
      from(BeaconHandler.removePermission(accountIdentifier)).pipe(
        map(() => {
          showSuccessToast('Permission successfully removed!');

          return loadPermissionsActions.submit();
        }),
        catchError(err => {
          showErrorToast(err.message);

          return EMPTY;
        })
      )
    )
  );

const approvePermissionRequestEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(approvePermissionRequestAction),
    toPayload(),
    switchMap(({ message, publicKey }) =>
      from(
        BeaconHandler.respond({
          type: BeaconMessageType.PermissionResponse,
          network: message.network,
          scopes: message.scopes,
          id: message.id,
          publicKey
        })
      ).pipe(
        map(() => {
          showSuccessToast('Successfully approved!');

          return navigateAction(StacksEnum.MainStack);
        }),
        catchError(err => {
          showErrorToast(err.message);

          return EMPTY;
        })
      )
    )
  );

const abortPermissionRequestEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(abortPermissionRequestAction),
    toPayload(),
    switchMap(({ message }) =>
      from(
        BeaconHandler.respond({
          type: BeaconMessageType.Error,
          id: message.id,
          errorType: BeaconErrorType.ABORTED_ERROR
        })
      ).pipe(
        map(() => {
          showSuccessToast('Connection aborted!');

          return navigateAction(StacksEnum.MainStack);
        }),
        catchError(err => {
          showErrorToast(err.message);

          return EMPTY;
        })
      )
    )
  );

export const dAppsEpics = combineEpics(
  loadPermissionsEpic,
  removePermissionEpic,
  approvePermissionRequestEpic,
  abortPermissionRequestEpic
);
