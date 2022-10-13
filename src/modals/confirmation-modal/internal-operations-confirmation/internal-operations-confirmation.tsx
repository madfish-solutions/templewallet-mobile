import { OpKind } from '@taquito/taquito';
import React, { FC } from 'react';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { everstakeApi } from '../../../api.service';
import { HeaderTitle } from '../../../components/header/header-title/header-title';
import { useNavigationSetOptions } from '../../../components/header/use-navigation-set-options.hook';
import { ApproveInternalOperationRequestActionPayloadInterface } from '../../../hooks/request-confirmation/approve-internal-operation-request-action-payload.interface';
import { useRequestConfirmation } from '../../../hooks/request-confirmation/use-request-confirmation.hook';
import { StacksEnum } from '../../../navigator/enums/stacks.enum';
import { addPendingActivity } from '../../../store/activity/activity-actions';
import { navigateAction } from '../../../store/root-state.actions';
import { useSelectedRpcUrlSelector } from '../../../store/settings/settings-selectors';
import { waitForOperationCompletionAction } from '../../../store/wallet/wallet-actions';
import { useSelectedAccountSelector } from '../../../store/wallet/wallet-selectors';
import { showSuccessToast } from '../../../toast/toast.utils';
import { TEMPLE_WALLET_EVERSTAKE_LINK_ID } from '../../../utils/env.utils';
import { parseOperationsToActivity } from '../../../utils/pending.utils';
import { sendTransaction$ } from '../../../utils/wallet.utils';
import { RECOMMENDED_BAKER_ADDRESS } from '../../select-baker-modal/select-baker-modal';
import { InternalOperationsConfirmationModalParams } from '../confirmation-modal.params';
import { OperationsConfirmation } from '../operations-confirmation/operations-confirmation';

type Props = Omit<InternalOperationsConfirmationModalParams, 'type'>;

const approveInternalOperationRequest = ({
  rpcUrl,
  sender,
  opParams
}: ApproveInternalOperationRequestActionPayloadInterface) =>
  sendTransaction$(rpcUrl, sender, opParams).pipe(
    switchMap(batch =>
      opParams[0]?.kind === OpKind.DELEGATION && opParams[0]?.delegate === RECOMMENDED_BAKER_ADDRESS
        ? of(
            everstakeApi.post('/delegations', {
              link_id: TEMPLE_WALLET_EVERSTAKE_LINK_ID,
              delegations: [batch.hash]
            })
          ).pipe(map(() => batch))
        : of(batch)
    ),
    switchMap(activity => {
      showSuccessToast({
        operationHash: activity.hash,
        description: 'Transaction request sent! Confirming...',
        title: 'Success!'
      });

      const pendingActivity = parseOperationsToActivity(activity, sender);

      return [
        navigateAction(StacksEnum.MainStack),
        addPendingActivity(pendingActivity),
        waitForOperationCompletionAction({ opHash: activity.hash, sender })
      ];
    })
  );

export const InternalOperationsConfirmation: FC<Props> = ({ opParams }) => {
  const selectedAccount = useSelectedAccountSelector();
  const rpcUrl = useSelectedRpcUrlSelector();

  const { confirmRequest, isLoading } = useRequestConfirmation(approveInternalOperationRequest);

  useNavigationSetOptions(
    {
      headerTitle: () => {
        switch (opParams[0]?.kind) {
          case OpKind.DELEGATION:
            return <HeaderTitle title="Confirm Delegate" />;
          case OpKind.TRANSACTION:
            return <HeaderTitle title="Confirm Send" />;
          default:
            return <HeaderTitle title="Confirm Operation" />;
        }
      }
    },
    []
  );

  return (
    <OperationsConfirmation
      sender={selectedAccount}
      opParams={opParams}
      isLoading={isLoading}
      onSubmit={newOpParams => confirmRequest({ rpcUrl, sender: selectedAccount, opParams: newOpParams })}
    />
  );
};
