import { BeaconMessageType, OperationRequestOutput } from '@airgap/beacon-sdk';
import React, { FC, useCallback, useMemo } from 'react';
import { from } from 'rxjs';
import { mapTo, switchMap } from 'rxjs/operators';

import { BeaconHandler } from 'src/beacon/beacon-handler';
import { Divider } from 'src/components/divider/divider';
import { ApproveOperationRequestActionPayloadInterface } from 'src/hooks/request-confirmation/approve-operation-request-action-payload.interface';
import { useDappRequestConfirmation } from 'src/hooks/request-confirmation/use-dapp-request-confirmation.hook';
import { emptyAccount } from 'src/interfaces/account.interface';
import { navigateBackAction } from 'src/store/root-state.actions';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { waitForOperationCompletionAction } from 'src/store/wallet/wallet-actions';
import { useAccountsListSelector } from 'src/store/wallet/wallet-selectors';
import { showSuccessToast } from 'src/toast/toast.utils';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { mapBeaconToTaquitoParams } from 'src/utils/beacon.utils';
import { sendTransaction$ } from 'src/utils/wallet.utils';

import { OperationsConfirmation } from '../../operations-confirmation/operations-confirmation';
import { AppMetadataView } from '../app-metadata-view/app-metadata-view';

interface Props {
  message: OperationRequestOutput;
}

const approveOperationRequest = ({
  rpcUrl,
  sender,
  opParams,
  message
}: ApproveOperationRequestActionPayloadInterface) =>
  sendTransaction$(rpcUrl, sender.publicKeyHash, opParams).pipe(
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

      return [waitForOperationCompletionAction({ opHash, sender }), navigateBackAction()];
    })
  );

export const OperationRequestConfirmation: FC<Props> = ({ message }) => {
  const accounts = useAccountsListSelector();
  const rpcUrl = useSelectedRpcUrlSelector();
  const { trackErrorEvent } = useAnalytics();

  const { confirmRequest, isLoading } = useDappRequestConfirmation(message, approveOperationRequest);

  const sender = useMemo(
    () => accounts.find(({ publicKeyHash }) => publicKeyHash === message.sourceAddress) ?? emptyAccount,
    [accounts, message.sourceAddress]
  );

  const opParams = useMemo(() => message.operationDetails.map(mapBeaconToTaquitoParams), [message]);

  const handleEstimationError = useCallback(
    (error: unknown) => {
      trackErrorEvent('DAppOperationsConfirmationEstimateError', error, [sender.publicKeyHash], { opParams, rpcUrl });
    },
    [trackErrorEvent, sender.publicKeyHash, opParams, rpcUrl]
  );

  return (
    <OperationsConfirmation
      sender={sender}
      opParams={opParams}
      isLoading={isLoading}
      onSubmit={newOpParams => confirmRequest({ rpcUrl, sender, opParams: newOpParams, message })}
      onEstimationError={handleEstimationError}
    >
      <AppMetadataView appMetadata={message.appMetadata} />
      <Divider />
    </OperationsConfirmation>
  );
};
