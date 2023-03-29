import { RouteProp, useRoute } from '@react-navigation/core';
import { Formik } from 'formik';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { CheckboxLabel } from 'src/components/checkbox-description/checkbox-label';
import { Divider } from 'src/components/divider/divider';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { TextLink } from 'src/components/text-link/text-link';
import { analyticsCollecting, privacyPolicy, termsOfUse } from 'src/config/socials';
import { FormBiometryCheckbox } from 'src/form/form-biometry-checkbox/form-biometry-checkbox';
import { FormCheckbox } from 'src/form/form-checkbox';
import { FormPasswordInput } from 'src/form/form-password-input';
import { ScreensEnum, ScreensParamList } from 'src/navigator/enums/screens.enum';
import { formatSize } from 'src/styles/format-size';
import { useSetPasswordScreensCommonStyles } from 'src/styles/set-password-screens-common-styles';
import { getRestoredCloudBackup } from 'src/utils/cloud-backup';
import { isString } from 'src/utils/is-string';

import {
  createNewPasswordInitialValues,
  createNewPasswordValidationSchema,
  useHandleSubmit
} from './create-new-wallet.form';
import { CreateNewWalletSelectors } from './create-new-wallet.selectors';

export const CreateNewWallet = () => {
  const { backupToCloud, cloudBackupId } = useRoute<RouteProp<ScreensParamList, ScreensEnum.CreateAccount>>().params;

  const { mnemonic: cloudBackupMnemonic, password: cloudBackupPassword } = getRestoredCloudBackup(cloudBackupId);

  const isRestoreFromCloudFlow = isString(cloudBackupMnemonic);

  useNavigationSetOptions(
    {
      headerTitle: () => (
        <HeaderTitle title={isRestoreFromCloudFlow ? 'Create a new password' : 'Create a new Wallet'} />
      )
    },
    [isRestoreFromCloudFlow]
  );

  const styles = useSetPasswordScreensCommonStyles();

  const initialValues = useMemo(
    () =>
      isString(cloudBackupPassword)
        ? {
            ...createNewPasswordInitialValues,
            password: cloudBackupPassword,
            passwordConfirmation: cloudBackupPassword
          }
        : createNewPasswordInitialValues,
    [cloudBackupPassword]
  );

  const handleSubmit = useHandleSubmit(backupToCloud, cloudBackupMnemonic);

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
                testID={CreateNewWalletSelectors.passwordInput}
              />

              <Label label="Repeat Password" description="Please enter the password again." />
              <FormPasswordInput name="passwordConfirmation" testID={CreateNewWalletSelectors.repeatPasswordInput} />

              <View style={styles.checkboxContainer} testID={CreateNewWalletSelectors.useBiometricsToUnlockCheckBox}>
                <FormBiometryCheckbox name="useBiometry" />
              </View>

              <View style={[styles.checkboxContainer, styles.removeMargin]}>
                <FormCheckbox name="analytics" testID={CreateNewWalletSelectors.analyticsCheckbox}>
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
                <FormCheckbox name="acceptTerms" testID={CreateNewWalletSelectors.acceptTermsCheckbox}>
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
              testID={CreateNewWalletSelectors.createButton}
            />
            <InsetSubstitute type="bottom" />
          </View>
        </>
      )}
    </Formik>
  );
};
