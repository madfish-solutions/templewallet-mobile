import { BeaconMessageType } from '@airgap/beacon-sdk';
import { PermissionRequestOutput } from '@airgap/beacon-sdk/dist/cjs/types/beacon/messages/BeaconRequestOutputMessage';
import { Formik } from 'formik';
import React, { FC, useMemo } from 'react';
import { EMPTY, from, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { BeaconHandler } from '../../../../beacon/beacon-handler';
import { AccountFormDropdown } from '../../../../components/account-dropdown/account-form-dropdown';
import { ButtonLargePrimary } from '../../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../../../components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from '../../../../components/divider/divider';
import { HeaderTitle } from '../../../../components/header/header-title/header-title';
import { useNavigationSetOptions } from '../../../../components/header/use-navigation-set-options.hook';
import { Label } from '../../../../components/label/label';
import { ModalButtonsContainer } from '../../../../components/modal-buttons-container/modal-buttons-container';
import { ScreenContainer } from '../../../../components/screen-container/screen-container';
import { ApprovePermissionRequestActionPayloadInterface } from '../../../../hooks/request-confirmation/approve-permission-request-action-payload.interface';
import { useRequestConfirmation } from '../../../../hooks/request-confirmation/use-request-confirmation.hook';
import { StacksEnum } from '../../../../navigator/enums/stacks.enum';
import { useNavigation } from '../../../../navigator/hooks/use-navigation.hook';
import { navigateAction } from '../../../../store/root-state.actions';
import { useAccountsListSelector, useSelectedAccountSelector } from '../../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../../styles/format-size';
import { showErrorToast, showSuccessToast } from '../../../../toast/toast.utils';
import { AppMetadataConnectionView } from './app-metadata-connection-view/app-metadata-connection-view';
import {
  PermissionRequestConfirmationFormValues,
  permissionRequestConfirmationModalValidationSchema
} from './permission-request-confirmation.form';
import { Action } from 'ts-action';

interface Props {
  message: PermissionRequestOutput;
}

export const PermissionRequestConfirmation: FC<Props> = ({ message }) => {
  const { goBack } = useNavigation();
  const accounts = useAccountsListSelector();
  const selectedAccount = useSelectedAccountSelector();

  const { confirmRequest, isLoading } = useRequestConfirmation(
    message,
    ({ message, publicKey }: ApprovePermissionRequestActionPayloadInterface) =>
      from(
        BeaconHandler.respond({
          type: BeaconMessageType.PermissionResponse,
          network: message.network,
          scopes: message.scopes,
          id: message.id,
          publicKey
        })
      ).pipe(
        map(() => {
          showSuccessToast({ description: 'Successfully approved!' });

          return navigateAction(StacksEnum.MainStack);
        }),
        catchError(err => {
          showErrorToast({ description: err.message });

          return EMPTY;
        })
      )
  );

  const formInitialValues = useMemo<PermissionRequestConfirmationFormValues>(
    () => ({ approver: selectedAccount }),
    [selectedAccount]
  );

  const onSubmit = ({ approver }: PermissionRequestConfirmationFormValues) =>
    void confirmRequest({
      message,
      publicKey: approver.publicKey
    });

  useNavigationSetOptions({ headerTitle: () => <HeaderTitle title="Confirm Connection" /> }, []);

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={permissionRequestConfirmationModalValidationSchema}
      onSubmit={onSubmit}
    >
      {({ submitForm }) => (
        <>
          <ScreenContainer>
            <AppMetadataConnectionView appMetadata={message.appMetadata} />
            <Divider size={formatSize(24)} />
            <Label label="Account" description="To be connected with dApp." />
            <AccountFormDropdown name="approver" list={accounts} />
          </ScreenContainer>
          <ModalButtonsContainer>
            <ButtonLargeSecondary title="Cancel" disabled={isLoading} onPress={goBack} />
            <Divider size={formatSize(16)} />
            <ButtonLargePrimary title="Confirm" disabled={isLoading} onPress={submitForm} />
          </ModalButtonsContainer>
        </>
      )}
    </Formik>
  );
};
