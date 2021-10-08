import { Formik } from 'formik';
import React, { FC, useEffect, useMemo } from 'react';
import { Text, View } from 'react-native';

import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { CheckboxLabel } from '../../../components/checkbox-description/checkbox-label';
import { Divider } from '../../../components/divider/divider';
import { HeaderButton } from '../../../components/header/header-button/header-button';
import { HeaderTitle } from '../../../components/header/header-title/header-title';
import { useNavigationSetOptions } from '../../../components/header/use-navigation-set-options.hook';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { InsetSubstitute } from '../../../components/inset-substitute/inset-substitute';
import { Label } from '../../../components/label/label';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { TextLink } from '../../../components/text-link/text-link';
import { EmptyFn } from '../../../config/general';
import { privacyPolicy, termsOfUse } from '../../../config/socials';
import { FormBiometryCheckbox } from '../../../form/form-biometry-checkbox/form-biometry-checkbox';
import { FormCheckbox } from '../../../form/form-checkbox';
import { FormPasswordInput } from '../../../form/form-password-input';
import { useShelter } from '../../../shelter/use-shelter.hook';
import { formatSize } from '../../../styles/format-size';
import { showWarningToast } from '../../../toast/toast.utils';
import { isString } from '../../../utils/is-string';
import { createNewPasswordValidationSchema, CreateNewPasswordFormValues } from './create-new-password.form';
import { CreateNewPasswordSelectors } from './create-new-password.selectors';
import { useCreateNewPasswordStyles } from './create-new-password.styles';

interface CreateNewPasswordProps {
  initialPassword?: string;
  onGoBackPress: EmptyFn;
  seedPhrase: string;
}

export const CreateNewPassword: FC<CreateNewPasswordProps> = ({ onGoBackPress, seedPhrase, initialPassword = '' }) => {
  const styles = useCreateNewPasswordStyles();
  const { importWallet } = useShelter();

  const handleSubmit = ({ password, useBiometry }: CreateNewPasswordFormValues) =>
    importWallet(seedPhrase, password, useBiometry);

  useNavigationSetOptions(
    {
      headerLeft: () => <HeaderButton iconName={IconNameEnum.ArrowLeft} onPress={onGoBackPress} />,
      headerTitle: () => <HeaderTitle title="Create a new password" />
    },
    [onGoBackPress]
  );

  useEffect(() => {
    if (isString(initialPassword)) {
      showWarningToast({
        description: 'The password from the previous screen was used'
      });
    }
  }, []);

  const createNewPasswordInitialValues = useMemo(
    () => ({
      password: initialPassword,
      passwordConfirmation: initialPassword,
      acceptTerms: false
    }),
    [initialPassword]
  );

  return (
    <Formik
      initialValues={createNewPasswordInitialValues}
      validationSchema={createNewPasswordValidationSchema}
      onSubmit={handleSubmit}>
      {({ submitForm, isValid }) => (
        <ScreenContainer isFullScreenMode={true}>
          <View>
            <Divider size={formatSize(12)} />
            <Label label="Password" description="A password is used to protect the wallet." />
            <FormPasswordInput name="password" testID={CreateNewPasswordSelectors.PasswordInput} />

            <Label label="Repeat Password" description="Please enter the password again." />
            <FormPasswordInput name="passwordConfirmation" testID={CreateNewPasswordSelectors.RepeatPasswordInput} />

            <View style={styles.checkboxContainer}>
              <FormBiometryCheckbox name="useBiometry" />
            </View>
          </View>
          <Divider />

          <View>
            <View style={styles.checkboxContainer}>
              <FormCheckbox name="acceptTerms" testID={CreateNewPasswordSelectors.AcceptTermsCheckbox}>
                <Divider size={formatSize(8)} />
                <Text style={styles.checkboxText}>Accept terms</Text>
              </FormCheckbox>
            </View>
            <CheckboxLabel>
              I have read and agree to{'\n'}the <TextLink url={termsOfUse}>Terms of Usage</TextLink> and{' '}
              <TextLink url={privacyPolicy}>Privacy Policy</TextLink>
            </CheckboxLabel>

            <Divider />
            <ButtonLargePrimary
              title="Import"
              disabled={!isValid}
              onPress={submitForm}
              testID={CreateNewPasswordSelectors.ImportButton}
            />
            <InsetSubstitute type="bottom" />
          </View>
        </ScreenContainer>
      )}
    </Formik>
  );
};
