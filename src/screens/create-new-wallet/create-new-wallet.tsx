import { Formik } from 'formik';
import React from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { CheckboxLabel } from '../../components/checkbox-description/checkbox-label';
import { Divider } from '../../components/divider/divider';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { Label } from '../../components/label/label';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { TextLink } from '../../components/text-link/text-link';
import { analyticsCollecting, privacyPolicy, termsOfUse } from '../../config/socials';
import { FormBiometryCheckbox } from '../../form/form-biometry-checkbox/form-biometry-checkbox';
import { FormCheckbox } from '../../form/form-checkbox';
import { FormPasswordInput } from '../../form/form-password-input';
import { useShelter } from '../../shelter/use-shelter.hook';
import { setIsAnalyticsEnabled, showLoaderAction } from '../../store/settings/settings-actions';
import { formatSize } from '../../styles/format-size';
import { useSetPasswordScreensCommonStyles } from '../../styles/set-password-screens-common-styles';
import { generateSeed } from '../../utils/keys.util';
import {
  CreateNewPasswordFormValues,
  createNewPasswordInitialValues,
  createNewPasswordValidationSchema
} from './create-new-wallet.form';
import { CreateNewWalletSelectors } from './create-new-wallet.selectors';

export const CreateNewWallet = () => {
  const dispatch = useDispatch();

  const styles = useSetPasswordScreensCommonStyles();
  const { importWallet } = useShelter();

  const handleSubmit = async ({ password, useBiometry, analytics }: CreateNewPasswordFormValues) => {
    dispatch(showLoaderAction());
    dispatch(setIsAnalyticsEnabled(analytics));
    const seedPhrase = await generateSeed();
    importWallet({ seedPhrase, password, useBiometry });
  };

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
                testID={CreateNewWalletSelectors.PasswordInput}
              />

              <Label label="Repeat Password" description="Please enter the password again." />
              <FormPasswordInput name="passwordConfirmation" testID={CreateNewWalletSelectors.RepeatPasswordInput} />

              <View style={styles.checkboxContainer}>
                <FormBiometryCheckbox name="useBiometry" />
              </View>

              <View style={[styles.checkboxContainer, styles.removeMargin]}>
                <FormCheckbox name="analytics" testID={CreateNewWalletSelectors.AnalyticsCheckbox}>
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
                <FormCheckbox name="acceptTerms" testID={CreateNewWalletSelectors.AcceptTermsCheckbox}>
                  <Divider size={formatSize(8)} />
                  <Text style={styles.checkboxText}>Accept terms</Text>
                </FormCheckbox>
              </View>
              <CheckboxLabel>
                I have read and agree to{'\n'}the <TextLink url={termsOfUse}>Terms of Use</TextLink> and{' '}
                <TextLink url={privacyPolicy}>Privacy Policy</TextLink>
              </CheckboxLabel>
            </View>
          </ScreenContainer>
          <View style={styles.fixedButtonContainer}>
            <ButtonLargePrimary
              title="Create"
              disabled={!isValid}
              onPress={submitForm}
              testID={CreateNewWalletSelectors.CreateButton}
            />
            <InsetSubstitute type="bottom" />
          </View>
        </>
      )}
    </Formik>
  );
};
