import { BeaconMessageType, PermissionRequestOutput } from '@airgap/beacon-sdk';
import React, { FC, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

import { BeaconHandler } from 'src/beacon/beacon-handler';
import { ApprovePermissionRequestActionPayloadInterface } from 'src/hooks/request-confirmation/approve-permission-request-action-payload.interface';
import { useDappRequestConfirmation } from 'src/hooks/request-confirmation/use-dapp-request-confirmation.hook';
import { AccountWithTezosAddress } from 'src/interfaces/account.interfaces';
import { navigateBackAction } from 'src/store/root-state.actions';
import { setSelectedAccountIdAction } from 'src/store/wallet/wallet-actions';
import { useAllAccounts, useAccount } from 'src/store/wallet/wallet-selectors';
import { showSuccessToast } from 'src/toast/toast.utils';
import { getAccountPublicKeyForTezos, hasTezosAddress } from 'src/utils/account.utils';

import { ConnectionRequestConfirmationContent } from '../../common/connection-request-confirmation/connection-request-confirmation-content';
import { ConnectionRequestConfirmationFormValues } from '../../common/connection-request-confirmation/form';

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
  const { name: appName, icon: iconUri, senderId: iconSeed } = message.appMetadata;
  const dispatch = useDispatch();
  const accounts = useAllAccounts();
  const selectedAccount = useAccount();
  const tezosAccounts = useMemo(() => accounts.filter(hasTezosAddress), [accounts]);

  const { confirmRequest, isLoading } = useDappRequestConfirmation(message, approvePermissionRequest);

  const formInitialValues = useMemo<ConnectionRequestConfirmationFormValues<AccountWithTezosAddress>>(
    () => ({ approver: hasTezosAddress(selectedAccount) ? selectedAccount : tezosAccounts[0] }),
    [selectedAccount, tezosAccounts]
  );

  const onSubmit = ({ approver }: ConnectionRequestConfirmationFormValues<AccountWithTezosAddress>) => {
    if (approver.id !== selectedAccount.id) {
      dispatch(setSelectedAccountIdAction(approver.id));
    }

    confirmRequest({ message, publicKey: getAccountPublicKeyForTezos(approver) });
  };

  return (
    <ConnectionRequestConfirmationContent
      appName={appName}
      iconUri={iconUri}
      iconSeed={iconSeed}
      accounts={tezosAccounts}
      initialValues={formInitialValues}
      isLoading={isLoading}
      onSubmit={onSubmit}
    />
  );
};
