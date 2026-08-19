import { Formik } from 'formik';
import React, { FC } from 'react';

import { AccountFormDropdown } from 'src/components/account-dropdown/account-form-dropdown';
import { Divider } from 'src/components/divider/divider';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { Account } from 'src/interfaces/account.interfaces';
import { ModalButtonsFloatingContainer } from 'src/layouts/modal-buttons-floating-container';
import { formatSize } from 'src/styles/format-size';

import { SlideToConfirmButton } from '../../slide-to-confirm-button';

import { AppMetadataConnectionView } from './app-metadata-connection-view';
import { ConnectionRequestConfirmationFormValues, connectionRequestConfirmationValidationSchema } from './form';

interface Props {
  appName: string;
  iconUri?: string;
  iconSeed: string;
  accounts: Account[];
  initialValues: ConnectionRequestConfirmationFormValues;
  isLoading: boolean;
  confirmTestID: string;
  onSubmit: SyncFn<ConnectionRequestConfirmationFormValues>;
}

export const ConnectionRequestConfirmationContent: FC<Props> = ({
  appName,
  iconUri,
  iconSeed,
  accounts,
  initialValues,
  isLoading,
  confirmTestID,
  onSubmit
}) => {
  useNavigationSetOptions({ headerTitle: () => <HeaderTitle title="Confirm Connection" /> }, []);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={connectionRequestConfirmationValidationSchema}
      onSubmit={onSubmit}
    >
      {({ submitForm }) => (
        <>
          <ScreenContainer>
            <AppMetadataConnectionView name={appName} iconUri={iconUri} iconSeed={iconSeed} />
            <Divider size={formatSize(24)} />
            <Label label="Account" description="To be connected with dApp." />
            <AccountFormDropdown name="approver" list={accounts} />
          </ScreenContainer>
          <ModalButtonsFloatingContainer variant="bordered">
            <SlideToConfirmButton isLoading={isLoading} onConfirm={submitForm} testID={confirmTestID} />
          </ModalButtonsFloatingContainer>
        </>
      )}
    </Formik>
  );
};
