import { FormikProvider, useFormik } from 'formik';
import React, { memo } from 'react';
import { View } from 'react-native';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from 'src/components/divider/divider';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { FormPasswordInput } from 'src/form/form-password-input';
import { useCallbackIfOnline } from 'src/hooks/use-callback-if-online';
import { ModalButtonsFloatingContainer } from 'src/layouts/modal-buttons-floating-container';
import { useShelter } from 'src/shelter/use-shelter.hook';
import { formatSize } from 'src/styles/format-size';

import {
  CreateNewPasswordFormValues,
  createNewPasswordInitialValues,
  createNewPasswordValidationSchema
} from './create-new-password.form';
import { CreateNewPasswordSyncAccountSelectors } from './create-new-password.selectors';

interface Props {
  seedPhrase: string;
  useBiometry?: boolean;
  hdAccountsLength?: number;
  onGoBackPress: EmptyFn;
}

export const CreateNewPassword = memo<Props>(({ seedPhrase, useBiometry, hdAccountsLength, onGoBackPress }) => {
  const { importWallet } = useShelter();

  const handleSubmit = ({ password }: CreateNewPasswordFormValues) =>
    importWallet({ seedPhrase, password, useBiometry, hdAccountsLength });

  useNavigationSetOptions(
    {
      headerTitle: () => <HeaderTitle title="Create Password" />
    },
    [onGoBackPress]
  );

  const formik = useFormik({
    initialValues: createNewPasswordInitialValues,
    validationSchema: createNewPasswordValidationSchema,
    onSubmit: handleSubmit
  });

  return (
    <FormikProvider value={formik}>
      <ScreenContainer isFullScreenMode={true}>
        <View>
          <Divider size={formatSize(12)} />
          <Label label="Password" description="A password is used to protect the wallet." />
          <FormPasswordInput
            isShowPasswordStrengthIndicator
            name="password"
            testID={CreateNewPasswordSyncAccountSelectors.passwordInput}
          />

          <Label label="Repeat Password" description="Please enter the password again." />
          <FormPasswordInput
            name="passwordConfirmation"
            testID={CreateNewPasswordSyncAccountSelectors.repeatPasswordInput}
          />
        </View>
      </ScreenContainer>

      <ModalButtonsFloatingContainer variant="bordered">
        <ButtonLargeSecondary title="Back" onPress={onGoBackPress} />
        <ButtonLargePrimary
          title="Sync"
          disabled={!formik.isValid}
          onPress={useCallbackIfOnline(formik.submitForm)}
          testID={CreateNewPasswordSyncAccountSelectors.syncButton}
        />
      </ModalButtonsFloatingContainer>
    </FormikProvider>
  );
});
