import { Formik } from 'formik';
import React, { FC, useMemo } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

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
import { analyticsCollecting, privacyPolicy, termsOfUse } from '../../../config/socials';
import { FormBiometryCheckbox } from '../../../form/form-biometry-checkbox/form-biometry-checkbox';
import { FormCheckbox } from '../../../form/form-checkbox';
import { FormPasswordInput } from '../../../form/form-password-input';
import { useShelter } from '../../../shelter/use-shelter.hook';
import { setIsAnalyticsEnabled } from '../../../store/settings/settings-actions';
import { useAnalyticsEnabledSelector } from '../../../store/settings/settings-selectors';
import { formatSize } from '../../../styles/format-size';
import { CreateNewPasswordFormValues, createNewPasswordValidationSchema } from './create-new-password.form';
import { CreateNewPasswordCreateAccountSelectors } from './create-new-password.selectors';
import { useCreateNewPasswordStyles } from './create-new-password.styles';

interface CreateNewPasswordProps {
  seedPhrase: string;
  onGoBackPress: () => void;
}

export const CreateNewPassword: FC<CreateNewPasswordProps> = ({ seedPhrase, onGoBackPress }) => {
  const dispatch = useDispatch();
  const analyticsEnabled = useAnalyticsEnabledSelector();

  const styles = useCreateNewPasswordStyles();
  const { importWallet } = useShelter();

  const handleSubmit = ({ password, useBiometry, analytics }: CreateNewPasswordFormValues) => {
    dispatch(setIsAnalyticsEnabled(analytics));
    importWallet({ seedPhrase, password, useBiometry });
  };

  useNavigationSetOptions(
    {
      headerLeft: () => <HeaderButton iconName={IconNameEnum.ArrowLeft} onPress={onGoBackPress} />,
      headerTitle: () => <HeaderTitle title="Create a new password" />
    },
    [onGoBackPress]
  );

  const createNewPasswordInitialValues: CreateNewPasswordFormValues = useMemo(
    () => ({
      password: '',
      passwordConfirmation: '',
      acceptTerms: false,
      analytics: analyticsEnabled
    }),
    [analyticsEnabled]
  );

  return (
    <Formik
      initialValues={createNewPasswordInitialValues}
      validationSchema={createNewPasswordValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ submitForm, isValid }) => (
        <ScreenContainer isFullScreenMode={true}>
          <View>
            <Divider size={formatSize(12)} />
            <Label label="Password" description="A password is used to protect the wallet." />
            <FormPasswordInput
              isShowPasswordStrengthIndicator
              name="password"
              testID={CreateNewPasswordCreateAccountSelectors.PasswordInput}
            />

            <Label label="Repeat Password" description="Please enter the password again." />
            <FormPasswordInput
              name="passwordConfirmation"
              testID={CreateNewPasswordCreateAccountSelectors.RepeatPasswordInput}
            />

            <View style={styles.checkboxContainer}>
              <FormBiometryCheckbox name="useBiometry" />
            </View>

            <View style={[styles.checkboxContainer, styles.removeMargin]}>
              <FormCheckbox name="analytics" testID={CreateNewPasswordCreateAccountSelectors.AnalyticsCheckbox}>
                <Divider size={formatSize(8)} />
                <Text style={styles.checkboxText}>Analytics</Text>
              </FormCheckbox>
            </View>
            <CheckboxLabel>
              I agree to the <TextLink url={analyticsCollecting}>anonymous information collecting</TextLink>
            </CheckboxLabel>
          </View>
          <Divider />

          <View>
            <View style={styles.checkboxContainer}>
              <FormCheckbox name="acceptTerms" testID={CreateNewPasswordCreateAccountSelectors.AcceptTermsCheckbox}>
                <Divider size={formatSize(8)} />
                <Text style={styles.checkboxText}>Accept terms</Text>
              </FormCheckbox>
            </View>
            <CheckboxLabel>
              I have read and agree to{'\n'}the <TextLink url={termsOfUse}>Terms of Use</TextLink> and{' '}
              <TextLink url={privacyPolicy}>Privacy Policy</TextLink>
            </CheckboxLabel>

            <Divider />
            <ButtonLargePrimary
              title="Create"
              disabled={!isValid}
              onPress={submitForm}
              testID={CreateNewPasswordCreateAccountSelectors.CreateButton}
            />
            <InsetSubstitute type="bottom" />
          </View>
        </ScreenContainer>
      )}
    </Formik>
  );
};
