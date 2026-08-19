import { Formik } from 'formik';
import React from 'react';

import { AccountFormDropdown } from 'src/components/account-dropdown/account-form-dropdown';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from 'src/components/divider/divider';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { Account } from 'src/interfaces/account.interfaces';
import { ModalButtonsFloatingContainer } from 'src/layouts/modal-buttons-floating-container';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';

import { PermissionRequestConfirmationSelectors } from '../../d-app-operations-confirmation/permission-request-confirmation/permission-request-confirmation.selectors';

import { AppMetadataConnectionView } from './app-metadata-connection-view';
import { ConnectionRequestConfirmationFormValues, connectionRequestConfirmationValidationSchema } from './form';

interface Props<T extends Account> {
  appName: string;
  iconUri?: string;
  iconSeed: string;
  accounts: T[];
  initialValues: ConnectionRequestConfirmationFormValues<T>;
  isLoading: boolean;
  onSubmit: SyncFn<ConnectionRequestConfirmationFormValues<T>>;
}

export const ConnectionRequestConfirmationContent = <T extends Account>({
  appName,
  iconUri,
  iconSeed,
  accounts,
  initialValues,
  isLoading,
  onSubmit
}: Props<T>) => {
  const { goBack } = useNavigation();

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
            <ButtonLargeSecondary
              title="Cancel"
              disabled={isLoading}
              onPress={goBack}
              testID={PermissionRequestConfirmationSelectors.cancelButton}
            />
            <ButtonLargePrimary
              title="Confirm"
              disabled={isLoading}
              onPress={submitForm}
              testID={PermissionRequestConfirmationSelectors.confirmButton}
            />
          </ModalButtonsFloatingContainer>
        </>
      )}
    </Formik>
  );
};
