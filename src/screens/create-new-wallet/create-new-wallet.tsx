import { RouteProp, useRoute } from '@react-navigation/core';
import { Formik } from 'formik';
import { isString } from 'lodash-es';
import React from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { CheckboxLabel } from 'src/components/checkbox-description/checkbox-label';
import { Divider } from 'src/components/divider/divider';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { TextLink } from 'src/components/text-link/text-link';
import { analyticsCollecting, privacyPolicy, termsOfUse } from 'src/config/socials';
import { FormBiometryCheckbox } from 'src/form/form-biometry-checkbox/form-biometry-checkbox';
import { FormCheckbox } from 'src/form/form-checkbox';
import { FormPasswordInput } from 'src/form/form-password-input';
import { ScreensEnum, ScreensParamList } from 'src/navigator/enums/screens.enum';
import { useShelter } from 'src/shelter/use-shelter.hook';
import {
  madeCloudBackupAction,
  requestSeedPhraseBackupAction,
  setIsAnalyticsEnabled,
  showLoaderAction
} from 'src/store/settings/settings-actions';
import { formatSize } from 'src/styles/format-size';
import { useSetPasswordScreensCommonStyles } from 'src/styles/set-password-screens-common-styles';
import { showErrorToast, showSuccessToast } from 'src/toast/toast.utils';
import { saveCloudBackup } from 'src/utils/cloud-backup';
import { generateSeed } from 'src/utils/keys.util';

import {
  CreateNewPasswordFormValues,
  createNewPasswordInitialValues,
  createNewPasswordValidationSchema
} from './create-new-wallet.form';
import { CreateNewWalletSelectors } from './create-new-wallet.selectors';

export const CreateNewWallet = () => {
  const dispatch = useDispatch();

  const {
    backupToCloud,
    password: passwordFromRoute,
    mnemonic: mnemonicFromRoute
  } = useRoute<RouteProp<ScreensParamList, ScreensEnum.CreateAccount>>().params;

  const styles = useSetPasswordScreensCommonStyles();
  const { importWallet } = useShelter();

  const initialValues = isString(passwordFromRoute)
    ? {
        ...createNewPasswordInitialValues,
        password: passwordFromRoute,
        passwordConfirmation: passwordFromRoute
      }
    : createNewPasswordInitialValues;

  const handleSubmit = async ({ password, useBiometry, analytics }: CreateNewPasswordFormValues) => {
    dispatch(showLoaderAction());
    dispatch(setIsAnalyticsEnabled(analytics));

    const seedPhrase = isString(mnemonicFromRoute) ? mnemonicFromRoute : await generateSeed();

    importWallet({ seedPhrase, password, useBiometry });

    //

    if (backupToCloud !== true) {
      if (!isString(mnemonicFromRoute)) {
        dispatch(requestSeedPhraseBackupAction());
      }

      return;
    }

    try {
      await saveCloudBackup(seedPhrase, password);
    } catch (error) {
      dispatch(requestSeedPhraseBackupAction());

      return void showErrorToast({ description: 'Failed to back up to cloud' });
    }

    dispatch(madeCloudBackupAction());
    showSuccessToast({ description: 'Your wallet has been backed up successfully!' });
  };

  return (
    <Formik initialValues={initialValues} validationSchema={createNewPasswordValidationSchema} onSubmit={handleSubmit}>
      {({ submitForm, isValid }) => (
        <>
          <ScreenContainer isFullScreenMode={true}>
            <View>
              <Divider size={formatSize(12)} />
              <Label
                label="Password"
                description={
                  Boolean(backupToCloud)
                    ? [
                        { text: 'A password is used to' },
                        { text: ' protect', bold: true },
                        { text: ' and' },
                        { text: ' backup', bold: true },
                        { text: ' the wallet.' }
                      ]
                    : 'A password is used to protect the wallet.'
                }
              />
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
