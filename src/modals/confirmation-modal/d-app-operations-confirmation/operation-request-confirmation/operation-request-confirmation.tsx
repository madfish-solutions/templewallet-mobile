import { BeaconMessageType, OperationRequestOutput } from '@airgap/beacon-sdk';
import React, { FC, useEffect, useMemo, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { EMPTY, from, Subject } from 'rxjs';
import { catchError, mapTo, switchMap } from 'rxjs/operators';

import { BeaconHandler } from '../../../../beacon/beacon-handler';
import { Divider } from '../../../../components/divider/divider';
import { ApproveOperationRequestActionPayloadInterface } from '../../../../interfaces/approve-operation-request-action-payload.interface';
import { emptyWalletAccount } from '../../../../interfaces/wallet-account.interface';
import { StacksEnum } from '../../../../navigator/enums/stacks.enum';
import { abortRequestAction } from '../../../../store/d-apps/d-apps-actions';
import { navigateAction } from '../../../../store/root-state.actions';
import { addPendingOperation, waitForOperationCompletionAction } from '../../../../store/wallet/wallet-actions';
import { useAccountsListSelector } from '../../../../store/wallet/wallet-selectors';
import { showErrorToast, showSuccessToast } from '../../../../toast/toast.utils';
import { mapBeaconToTaquitoParams } from '../../../../utils/beacon.utils';
import { paramsToPendingActions } from '../../../../utils/params-to-actions.util';
import { sendTransaction$ } from '../../../../utils/wallet.utils';
import { OperationsConfirmation } from '../../operations-confirmation/operations-confirmation';
import { AppMetadataView } from '../app-metadata-view/app-metadata-view';

interface Props {
  message: OperationRequestOutput;
}

export const OperationRequestConfirmation: FC<Props> = ({ message }) => {
  const dispatch = useDispatch();
  const accounts = useAccountsListSelector();
  const isConfirmed = useRef(false);
  const confirmRequest$ = useMemo(() => new Subject<ApproveOperationRequestActionPayloadInterface>(), []);

  const sender = useMemo(
    () => accounts.find(({ publicKeyHash }) => publicKeyHash === message.sourceAddress) ?? emptyWalletAccount,
    [accounts, message.sourceAddress]
  );

  const opParams = message.operationDetails.map(mapBeaconToTaquitoParams);

  useEffect(() => {
    return () => {
      console.log(isConfirmed.current);
      if (!isConfirmed.current) {
        dispatch(abortRequestAction(message.id));
      }
    };
  }, []);

  useEffect(() => {
    const subscription = confirmRequest$
      .pipe(
        switchMap(({ message, sender, opParams }) =>
          sendTransaction$(sender, opParams).pipe(
            switchMap(({ hash }) =>
              from(
                BeaconHandler.respond({
                  type: BeaconMessageType.OperationResponse,
                  id: message.id,
                  transactionHash: hash
                })
              ).pipe(mapTo(hash))
            ),
            switchMap(opHash => {
              showSuccessToast({
                operationHash: opHash,
                description: 'Transaction request sent! Confirming...',
                title: 'Success!'
              });

              return [
                waitForOperationCompletionAction({ opHash, sender }),
                addPendingOperation(paramsToPendingActions(opParams, opHash, sender.publicKeyHash)),
                navigateAction(StacksEnum.MainStack)
              ];
            }),
            catchError(err => {
              showErrorToast({ description: err.message });

              return EMPTY;
            })
          )
        )
      )
      .subscribe(action => {
        isConfirmed.current = true;
        dispatch(action);
      });

    return () => subscription.unsubscribe();
  }, [confirmRequest$]);

  return (
    <OperationsConfirmation
      sender={sender}
      opParams={opParams}
      onSubmit={newOpParams => confirmRequest$.next({ message, sender, opParams: newOpParams })}>
      <AppMetadataView appMetadata={message.appMetadata} />
      <Divider />
    </OperationsConfirmation>
  );
};
