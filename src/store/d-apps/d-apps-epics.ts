import { BeaconErrorType, BeaconMessageType, getSenderId } from '@airgap/beacon-sdk';
import { combineEpics } from 'redux-observable';
import { EMPTY, forkJoin, from, Observable, of } from 'rxjs';
import { catchError, map, mapTo, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { BeaconHandler } from '../../beacon/beacon-handler';
import { StacksEnum } from '../../navigator/enums/stacks.enum';
import { Shelter } from '../../shelter/shelter';
import { showErrorToast, showSuccessToast } from '../../toast/toast.utils';
import { paramsToPendingActions } from '../../utils/params-to-actions.util';
import { sendTransaction$ } from '../../utils/wallet.utils';
import { navigateAction } from '../root-state.actions';
import { addPendingOperation } from '../wallet/wallet-actions';
import {
  abortRequestAction,
  approveOperationRequestAction,
  approvePermissionRequestAction,
  approveSignPayloadRequestAction,
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
    switchMap(({ accountIdentifier, senderId }) =>
      from(BeaconHandler.getPeers()).pipe(
        switchMap(peers =>
          forkJoin(
            peers.map(peer =>
              from(getSenderId(peer.publicKey)).pipe(
                switchMap(peerSenderId =>
                  senderId === peerSenderId ? BeaconHandler.removePeer({ ...peer, senderId: peerSenderId }) : EMPTY
                )
              )
            )
          ).pipe(
            switchMap(() => BeaconHandler.removePermission(accountIdentifier)),
            map(() => {
              showSuccessToast({ text: 'Permission successfully removed!' });

              return loadPermissionsActions.submit();
            }),
            catchError(err => {
              showErrorToast({ text: err.message });

              return EMPTY;
            })
          )
        )
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
          showSuccessToast({ text: 'Successfully approved!' });

          return navigateAction(StacksEnum.MainStack);
        }),
        catchError(err => {
          showErrorToast({ text: err.message });

          return EMPTY;
        })
      )
    )
  );

const approveSignPayloadRequestEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(approveSignPayloadRequestAction),
    toPayload(),
    switchMap(message =>
      Shelter.getSigner$(message.sourceAddress).pipe(
        switchMap(signer => signer.sign(message.payload)),
        switchMap(({ prefixSig }) =>
          BeaconHandler.respond({
            type: BeaconMessageType.SignPayloadResponse,
            id: message.id,
            signingType: message.signingType,
            signature: prefixSig
          })
        ),
        map(() => {
          showSuccessToast({ text: 'Successfully signed!' });

          return navigateAction(StacksEnum.MainStack);
        }),
        catchError(err => {
          showErrorToast({ text: err.message });

          return EMPTY;
        })
      )
    )
  );

const approveOperationRequestEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(approveOperationRequestAction),
    toPayload(),
    switchMap(({ message, sender, opParams }) =>
      sendTransaction$(sender, opParams).pipe(
        switchMap(({ opHash }) =>
          from(
            BeaconHandler.respond({
              type: BeaconMessageType.OperationResponse,
              id: message.id,
              transactionHash: opHash
            })
          ).pipe(mapTo(opHash))
        ),
        switchMap(opHash => {
          showSuccessToast({
            operationHash: opHash,
            text: 'Transaction request sent! Confirming...',
            title: 'Success!'
          });

          return [
            navigateAction(StacksEnum.MainStack),
            addPendingOperation(paramsToPendingActions(opParams, opHash, sender.publicKeyHash))
          ];
        }),
        catchError(err => {
          showErrorToast({ text: err.message });

          return EMPTY;
        })
      )
    )
  );

const abortRequestEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(abortRequestAction),
    toPayload(),
    switchMap(id =>
      from(
        BeaconHandler.respond({
          id,
          type: BeaconMessageType.Error,
          errorType: BeaconErrorType.ABORTED_ERROR
        })
      ).pipe(
        map(() => {
          showSuccessToast({ text: 'Request aborted!' });

          return navigateAction(StacksEnum.MainStack);
        }),
        catchError(err => {
          showErrorToast({ text: err.message });

          return EMPTY;
        })
      )
    )
  );

export const dAppsEpics = combineEpics(
  loadPermissionsEpic,
  removePermissionEpic,
  approvePermissionRequestEpic,
  approveSignPayloadRequestEpic,
  approveOperationRequestEpic,
  abortRequestEpic
);
