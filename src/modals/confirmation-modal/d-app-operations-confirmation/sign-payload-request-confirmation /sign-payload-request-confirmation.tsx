import { SignPayloadRequestOutput } from '@airgap/beacon-sdk/dist/cjs/types/beacon/messages/BeaconRequestOutputMessage';
import React, { FC, useMemo } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { AccountDropdownItem } from '../../../../components/account-dropdown/account-dropdown-item/account-dropdown-item';
import { ButtonLargePrimary } from '../../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../../../components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from '../../../../components/divider/divider';
import { Label } from '../../../../components/label/label';
import { ModalButtonsContainer } from '../../../../components/modal-buttons-container/modal-buttons-container';
import { ScreenContainer } from '../../../../components/screen-container/screen-container';
import { emptyWalletAccount } from '../../../../interfaces/wallet-account.interface';
import { abortRequestAction, approveSignPayloadRequestAction } from '../../../../store/d-apps/d-apps-actions';
import { useHdAccountsListSelector } from '../../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../../styles/format-size';
import { AppMetadataView } from '../app-metadata-view/app-metadata-view';
import { useSignPayloadRequestConfirmationStyles } from './sign-payload-request-confirmation.styles';

interface Props {
  message: SignPayloadRequestOutput;
}

export const SignPayloadRequestConfirmation: FC<Props> = ({ message }) => {
  const styles = useSignPayloadRequestConfirmationStyles();
  const dispatch = useDispatch();
  const hdAccounts = useHdAccountsListSelector();

  const approver = useMemo(
    () => hdAccounts.find(({ publicKeyHash }) => publicKeyHash === message.sourceAddress) ?? emptyWalletAccount,
    [hdAccounts, message.sourceAddress]
  );

  return (
    <>
      <ScreenContainer>
        <AppMetadataView appMetadata={message.appMetadata} />
        <Divider />
        <Label label="Account" />
        <Divider />
        <AccountDropdownItem account={approver} />
        <Divider />
        <View style={styles.descriptionContainer}>
          <Divider size={formatSize(12)} />
          <Text style={styles.descriptionText}>Payload to sign</Text>
          <Divider size={formatSize(12)} />
        </View>
        <Divider size={formatSize(16)} />
        <Text style={styles.payloadText}>{message.payload}</Text>
      </ScreenContainer>
      <ModalButtonsContainer>
        <ButtonLargeSecondary title="Cancel" onPress={() => dispatch(abortRequestAction(message.id))} />
        <Divider size={formatSize(16)} />
        <ButtonLargePrimary title="Sign" onPress={() => dispatch(approveSignPayloadRequestAction(message))} />
      </ModalButtonsContainer>
    </>
  );
};
