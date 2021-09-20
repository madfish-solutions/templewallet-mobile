import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { approveInternalOperationRequestAction } from '../../../store/wallet/wallet-actions';
import { useSelectedAccountSelector } from '../../../store/wallet/wallet-selectors';
import { InternalOperationsConfirmationModalParams } from '../confirmation-modal.params';
import { OperationsConfirmation } from '../operations-confirmation/operations-confirmation';

type Props = Omit<InternalOperationsConfirmationModalParams, 'type'>;

export const InternalOperationsConfirmation: FC<Props> = ({ opParams }) => {
  const dispatch = useDispatch();

  const selectedAccount = useSelectedAccountSelector();

  return (
    <OperationsConfirmation
      sender={selectedAccount}
      opParams={opParams}
      onSubmit={opParams => dispatch(approveInternalOperationRequestAction(opParams))}
    />
  );
};
