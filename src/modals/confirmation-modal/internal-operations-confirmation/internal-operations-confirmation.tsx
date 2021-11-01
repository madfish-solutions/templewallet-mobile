import { OpKind } from '@taquito/taquito';
import React, { FC } from 'react';
import { switchMap } from 'rxjs/operators';

import { HeaderTitle } from '../../../components/header/header-title/header-title';
import { useNavigationSetOptions } from '../../../components/header/use-navigation-set-options.hook';
import { ApproveInternalOperationRequestActionPayloadInterface } from '../../../hooks/request-confirmation/approve-internal-operation-request-action-payload.interface';
import { useRequestConfirmation } from '../../../hooks/request-confirmation/use-request-confirmation.hook';
import { StacksEnum } from '../../../navigator/enums/stacks.enum';
import { navigateAction } from '../../../store/root-state.actions';
import { useSelectedRpcUrlSelector } from '../../../store/settings/settings-selectors';
import { addPendingOperation, waitForOperationCompletionAction } from '../../../store/wallet/wallet-actions';
import { useSelectedAccountSelector } from '../../../store/wallet/wallet-selectors';
import { showSuccessToast } from '../../../toast/toast.utils';
import { paramsToPendingActions } from '../../../utils/params-to-actions.util';
import { sendTransaction$ } from '../../../utils/wallet.utils';
import { InternalOperationsConfirmationModalParams } from '../confirmation-modal.params';
import { OperationsConfirmation } from '../operations-confirmation/operations-confirmation';

type Props = Omit<InternalOperationsConfirmationModalParams, 'type'>;

const approveInternalOperationRequest = ({
  rpcUrl,
  sender,
  opParams
}: ApproveInternalOperationRequestActionPayloadInterface) =>
  sendTransaction$(rpcUrl, sender, opParams).pipe(
    switchMap(({ hash }) => {
      showSuccessToast({
        operationHash: hash,
        description: 'Transaction request sent! Confirming...',
        title: 'Success!'
      });

      return [
        navigateAction(StacksEnum.MainStack),
        waitForOperationCompletionAction({ opHash: hash, sender }),
        addPendingOperation(paramsToPendingActions(opParams, hash, sender.publicKeyHash))
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
        switch (opParams[0].kind) {
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
