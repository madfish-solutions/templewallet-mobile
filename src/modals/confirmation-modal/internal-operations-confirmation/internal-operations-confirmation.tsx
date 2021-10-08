import { OpKind } from '@taquito/taquito';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { HeaderTitle } from '../../../components/header/header-title/header-title';
import { useNavigationSetOptions } from '../../../components/header/use-navigation-set-options.hook';
import { approveInternalOperationRequestAction } from '../../../store/wallet/wallet-actions';
import { useSelectedAccountSelector } from '../../../store/wallet/wallet-selectors';
import { InternalOperationsConfirmationModalParams } from '../confirmation-modal.params';
import { OperationsConfirmation } from '../operations-confirmation/operations-confirmation';

type Props = Omit<InternalOperationsConfirmationModalParams, 'type'>;

export const InternalOperationsConfirmation: FC<Props> = ({ opParams }) => {
  const dispatch = useDispatch();

  const selectedAccount = useSelectedAccountSelector();

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
      onSubmit={opParams => dispatch(approveInternalOperationRequestAction(opParams))}
    />
  );
};
