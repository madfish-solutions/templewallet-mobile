import { BeaconMessageType, PermissionRequestOutput } from '@airgap/beacon-sdk';
import React, { FC, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

import { BeaconHandler } from 'src/beacon/beacon-handler';
import { ApprovePermissionRequestActionPayloadInterface } from 'src/hooks/request-confirmation/approve-permission-request-action-payload.interface';
import { useDappRequestConfirmation } from 'src/hooks/request-confirmation/use-dapp-request-confirmation.hook';
import { navigateBackAction } from 'src/store/root-state.actions';
import { setSelectedAccountIdAction } from 'src/store/wallet/wallet-actions';
import { useAllAccounts, useAccount } from 'src/store/wallet/wallet-selectors';
import { showSuccessToast } from 'src/toast/toast.utils';
import { getAccountAddressForTezos, getAccountPublicKeyForTezos } from 'src/utils/account.utils';

import { ConnectionRequestConfirmationContent } from '../../common/connection-request-confirmation/connection-request-confirmation-content';
import { ConnectionRequestConfirmationFormValues } from '../../common/connection-request-confirmation/form';

import { PermissionRequestConfirmationSelectors } from './permission-request-confirmation.selectors';

interface Props {
  message: PermissionRequestOutput;
}

const approvePermissionRequest = ({ message, publicKey }: ApprovePermissionRequestActionPayloadInterface) =>
  from(
    BeaconHandler.respond({
      type: BeaconMessageType.PermissionResponse,
      network: message.network,
      scopes: message.scopes,
      id: message.id,
      publicKey,
      walletType: 'implicit'
    })
  ).pipe(
    map(() => {
      showSuccessToast({ description: 'Successfully approved!' });

      return navigateBackAction();
    })
  );

export const PermissionRequestConfirmation: FC<Props> = ({ message }) => {
  const dispatch = useDispatch();
  const accounts = useAllAccounts();
  const selectedAccount = useAccount();
  const tezosAccounts = useMemo(() => accounts.filter(account => getAccountAddressForTezos(account)), [accounts]);

  const { confirmRequest, isLoading } = useDappRequestConfirmation(message, approvePermissionRequest);

  const formInitialValues = useMemo<ConnectionRequestConfirmationFormValues>(
    () => ({ approver: getAccountAddressForTezos(selectedAccount) ? selectedAccount : tezosAccounts[0] }),
    [selectedAccount, tezosAccounts]
  );

  const onSubmit = ({ approver }: ConnectionRequestConfirmationFormValues) => {
    if (approver.id !== selectedAccount.id) {
      dispatch(setSelectedAccountIdAction(approver.id));
    }

    const publicKey = getAccountPublicKeyForTezos(approver);

    if (!publicKey) {
      return;
    }

    confirmRequest({
      message,
      publicKey
    });
  };

  return (
    <ConnectionRequestConfirmationContent
      appName={message.appMetadata.name}
      iconUri={message.appMetadata.icon}
      iconSeed={message.appMetadata.senderId}
      accounts={tezosAccounts}
      initialValues={formInitialValues}
      isLoading={isLoading}
      confirmTestID={PermissionRequestConfirmationSelectors.confirmButton}
      onSubmit={onSubmit}
    />
  );
};
