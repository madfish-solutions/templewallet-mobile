import { PermissionRequestOutput } from '@airgap/beacon-sdk/dist/cjs/types/beacon/messages/BeaconRequestOutputMessage';
import { Formik } from 'formik';
import React, { FC, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { AccountFormDropdown } from '../../../../components/account-dropdown/account-form-dropdown';
import { ButtonLargePrimary } from '../../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../../../components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from '../../../../components/divider/divider';
import { Label } from '../../../../components/label/label';
import { ModalButtonsContainer } from '../../../../components/modal-buttons-container/modal-buttons-container';
import { ScreenContainer } from '../../../../components/screen-container/screen-container';
import { abortPermissionRequestAction, approvePermissionRequestAction } from '../../../../store/d-apps/d-apps-actions';
import { useHdAccountsListSelector, useSelectedAccountSelector } from '../../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../../styles/format-size';
import { AppMetadataConnectionView } from './app-metadata-connection-view/app-metadata-connection-view';
import {
  PermissionRequestConfirmationFormValues,
  permissionRequestConfirmationModalValidationSchema
} from './permission-request-confirmation.form';

interface Props {
  message: PermissionRequestOutput;
}

export const PermissionRequestConfirmation: FC<Props> = ({ message }) => {
  const dispatch = useDispatch();
  const hdAccounts = useHdAccountsListSelector();
  const selectedAccount = useSelectedAccountSelector();

  const formInitialValues = useMemo<PermissionRequestConfirmationFormValues>(
    () => ({ approver: selectedAccount }),
    [selectedAccount]
  );

  const handleCancelButtonPress = () => dispatch(abortPermissionRequestAction({ message }));
  const onSubmit = ({ approver }: PermissionRequestConfirmationFormValues) =>
    void dispatch(
      approvePermissionRequestAction({
        message,
        publicKey: approver.publicKey
      })
    );

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={permissionRequestConfirmationModalValidationSchema}
      onSubmit={onSubmit}>
      {({ submitForm }) => (
        <>
          <ScreenContainer>
            <AppMetadataConnectionView appMetadata={message.appMetadata} />
            <Divider size={formatSize(24)} />
            <Label label="Account" description="To be connected with dApp." />
            <AccountFormDropdown name="approver" list={hdAccounts} />
          </ScreenContainer>
          <ModalButtonsContainer>
            <ButtonLargeSecondary title="Cancel" onPress={handleCancelButtonPress} />
            <Divider size={formatSize(16)} />
            <ButtonLargePrimary title="Confirm" onPress={submitForm} />
          </ModalButtonsContainer>
        </>
      )}
    </Formik>
  );
};
