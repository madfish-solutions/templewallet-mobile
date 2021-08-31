import { OperationRequestOutput } from '@airgap/beacon-sdk';
import React, { FC, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { Divider } from '../../../../components/divider/divider';
import { emptyWalletAccount } from '../../../../interfaces/wallet-account.interface';
import { abortRequestAction, approveOperationRequestAction } from '../../../../store/d-apps/d-apps-actions';
import { useAccountsListSelector } from '../../../../store/wallet/wallet-selectors';
import { mapBeaconToTaquitoParams } from '../../../../utils/beacon.utils';
import { OperationsConfirmation } from '../../operations-confirmation/operations-confirmation';
import { AppMetadataView } from '../app-metadata-view/app-metadata-view';

interface Props {
  message: OperationRequestOutput;
}

export const OperationRequestConfirmation: FC<Props> = ({ message }) => {
  const dispatch = useDispatch();
  const accounts = useAccountsListSelector();

  const sender = useMemo(
    () => accounts.find(({ publicKeyHash }) => publicKeyHash === message.sourceAddress) ?? emptyWalletAccount,
    [accounts, message.sourceAddress]
  );

  const opParams = message.operationDetails.map(mapBeaconToTaquitoParams);

  return (
    <OperationsConfirmation
      sender={sender}
      opParams={opParams}
      onSubmit={opParams => dispatch(approveOperationRequestAction({ message, sender, opParams }))}
      onBackButtonPress={() => dispatch(abortRequestAction(message.id))}>
      <AppMetadataView appMetadata={message.appMetadata} />
      <Divider />
    </OperationsConfirmation>
  );
};
