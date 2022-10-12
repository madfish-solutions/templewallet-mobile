import { BeaconMessageType, OperationRequestOutput } from '@airgap/beacon-sdk';
import React, { FC, useMemo } from 'react';
import { from } from 'rxjs';
import { mapTo, switchMap } from 'rxjs/operators';

import { BeaconHandler } from '../../../../beacon/beacon-handler';
import { Divider } from '../../../../components/divider/divider';
import { ActivityStatusEnum } from '../../../../enums/activity-status.enum';
import { ActivityTypeEnum } from '../../../../enums/activity-type.enum';
import { ApproveOperationRequestActionPayloadInterface } from '../../../../hooks/request-confirmation/approve-operation-request-action-payload.interface';
import { useDappRequestConfirmation } from '../../../../hooks/request-confirmation/use-dapp-request-confirmation.hook';
import { emptyAccount } from '../../../../interfaces/account.interface';
import { ActivityInterface } from '../../../../interfaces/activity.interface';
import { emptyMember } from '../../../../interfaces/member.interface';
import { StacksEnum } from '../../../../navigator/enums/stacks.enum';
import { addPendingActivity } from '../../../../store/activity/activity-actions';
import { navigateAction } from '../../../../store/root-state.actions';
import { useSelectedRpcUrlSelector } from '../../../../store/settings/settings-selectors';
import { waitForOperationCompletionAction } from '../../../../store/wallet/wallet-actions';
import { useAccountsListSelector } from '../../../../store/wallet/wallet-selectors';
import { showSuccessToast } from '../../../../toast/toast.utils';
import { mapBeaconToTaquitoParams } from '../../../../utils/beacon.utils';
import { sendTransaction$ } from '../../../../utils/wallet.utils';
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
  sendTransaction$(rpcUrl, sender, opParams).pipe(
    switchMap(activity =>
      from(
        BeaconHandler.respond({
          type: BeaconMessageType.OperationResponse,
          id: message.id,
          transactionHash: activity.hash
        })
      ).pipe(mapTo(activity))
    ),
    switchMap(activity => {
      showSuccessToast({
        operationHash: activity.hash,
        description: 'Transaction request sent! Confirming...',
        title: 'Success!'
      });

      const pendingActivity: ActivityInterface = {
        ...activity,
        type: ActivityTypeEnum.Transaction,
        status: ActivityStatusEnum.Pending,
        amount: '0',
        timestamp: Date.now(),
        destination: emptyMember,
        source: emptyMember,
        id: -1
      };

      return [
        waitForOperationCompletionAction({ opHash: activity.hash, sender }),
        addPendingActivity([pendingActivity]),
        navigateAction(StacksEnum.MainStack)
      ];
    })
  );

export const OperationRequestConfirmation: FC<Props> = ({ message }) => {
  const accounts = useAccountsListSelector();
  const rpcUrl = useSelectedRpcUrlSelector();

  const { confirmRequest, isLoading } = useDappRequestConfirmation(message, approveOperationRequest);

  const sender = useMemo(
    () => accounts.find(({ publicKeyHash }) => publicKeyHash === message.sourceAddress) ?? emptyAccount,
    [accounts, message.sourceAddress]
  );

  const opParams = message.operationDetails.map(mapBeaconToTaquitoParams);

  return (
    <OperationsConfirmation
      sender={sender}
      opParams={opParams}
      isLoading={isLoading}
      onSubmit={newOpParams => confirmRequest({ rpcUrl, sender, opParams: newOpParams, message })}
    >
      <AppMetadataView appMetadata={message.appMetadata} />
      <Divider />
    </OperationsConfirmation>
  );
};
