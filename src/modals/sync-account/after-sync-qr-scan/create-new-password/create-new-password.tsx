import { Formik } from 'formik';
import React, { FC } from 'react';
import { View } from 'react-native';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from 'src/components/button/buttons-container/buttons-container';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { Divider } from 'src/components/divider/divider';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { FormPasswordInput } from 'src/form/form-password-input';
import { useShelter } from 'src/shelter/use-shelter.hook';
import { formatSize } from 'src/styles/format-size';
import { useSetPasswordScreensCommonStyles } from 'src/styles/set-password-screens-common-styles';

import {
  CreateNewPasswordFormValues,
  createNewPasswordInitialValues,
  createNewPasswordValidationSchema
} from './create-new-password.form';
import { CreateNewPasswordSyncAccountSelectors } from './create-new-password.selectors';

interface CreateNewPasswordProps {
  seedPhrase: string;
  useBiometry?: boolean;
  hdAccountsLength?: number;
  onGoBackPress: EmptyFn;
}

export const CreateNewPassword: FC<CreateNewPasswordProps> = ({
  seedPhrase,
  useBiometry,
  hdAccountsLength,
  onGoBackPress
}) => {
  const { importWallet } = useShelter();
  const styles = useSetPasswordScreensCommonStyles();

  const handleSubmit = ({ password }: CreateNewPasswordFormValues) =>
    importWallet({ seedPhrase, password, useBiometry, hdAccountsLength });

  useNavigationSetOptions(
    {
      headerTitle: () => <HeaderTitle title="Create Password" />
    },
    [onGoBackPress]
  );

  return (
    <Formik
      initialValues={createNewPasswordInitialValues}
      validationSchema={createNewPasswordValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ submitForm, isValid }) => (
        <>
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

          <ButtonsFloatingContainer>
            <ButtonsContainer style={styles.buttonsContainer}>
              <View style={styles.buttonBox}>
                <ButtonLargeSecondary title="Back" onPress={onGoBackPress} />
              </View>
              <View style={styles.buttonBox}>
                <ButtonLargePrimary
                  title="Sync"
                  disabled={!isValid}
                  onPress={submitForm}
                  testID={CreateNewPasswordSyncAccountSelectors.syncButton}
                />
              </View>
            </ButtonsContainer>
            <InsetSubstitute type="bottom" />
          </ButtonsFloatingContainer>
        </>
      )}
    </Formik>
  );
};
