import { RouteProp, useRoute } from '@react-navigation/core';
import { Formik } from 'formik';
import React, { useMemo, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { CheckboxLabel } from 'src/components/checkbox-description/checkbox-label';
import { Divider } from 'src/components/divider/divider';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { TextLink } from 'src/components/text-link/text-link';
import { privacyPolicy, termsOfUse } from 'src/config/socials';
import { FormBiometryCheckbox } from 'src/form/form-biometry-checkbox/form-biometry-checkbox';
import { FormCheckbox } from 'src/form/form-checkbox';
import { FormPasswordInput } from 'src/form/form-password-input';
import { ScreensEnum, ScreensParamList } from 'src/navigator/enums/screens.enum';
import { formatSize } from 'src/styles/format-size';
import { useSetPasswordScreensCommonStyles } from 'src/styles/set-password-screens-common-styles';
import { useRestoredCloudBackup } from 'src/utils/cloud-backup';
import { isString } from 'src/utils/is-string';

import { AnalyticsField } from './AnalyticsField';
import {
  BackupFlow,
  createNewPasswordInitialValues,
  createNewPasswordValidationSchema,
  useHandleSubmit
} from './create-new-wallet.form';
import { CreateNewWalletSelectors } from './create-new-wallet.selectors';
import { ViewAdsField } from './view-ads-field';

export const CreateNewWallet = () => {
  const { backupToCloud, cloudBackupId } = useRoute<RouteProp<ScreensParamList, ScreensEnum.CreateAccount>>().params;

  const { mnemonic: cloudBackupMnemonic, password: cloudBackupPassword } = useRestoredCloudBackup(cloudBackupId);

  let backupFlow: BackupFlow | undefined;
  if (isString(cloudBackupMnemonic)) {
    backupFlow = {
      type: 'RESTORE',
      mnemonic: cloudBackupMnemonic
    };
  } else if (backupToCloud === true) {
    backupFlow = { type: 'AUTO_BACKUP' };
  }

  useNavigationSetOptions(
    {
      headerTitle: () => (
        <HeaderTitle title={backupFlow?.type === 'RESTORE' ? 'Create a new password' : 'Create a new Wallet'} />
      )
    },
    [backupFlow?.type]
  );

  const styles = useSetPasswordScreensCommonStyles();

  const refScrollView = useRef<ScrollView>(null);
  const [fieldsPositions, setFieldsPositions] = useState({
    password: 0,
    acceptTerms: 0
  });

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

  const handleSubmit = useHandleSubmit(backupFlow);
  const handleLayoutChange = (name: string, value: number) =>
    setFieldsPositions(prevState => ({ ...prevState, [name]: value }));

  return (
    <Formik initialValues={initialValues} validationSchema={createNewPasswordValidationSchema} onSubmit={handleSubmit}>
      {({ submitForm, isValid, values, errors }) => (
        <>
          <ScreenContainer scrollViewRef={refScrollView} isFullScreenMode={true}>
            <View style={styles.mb40}>
              <Divider size={formatSize(12)} />
              <View onLayout={event => handleLayoutChange('password', event.nativeEvent.layout.y)}>
                <Label
                  label="Password"
                  description={
                    backupFlow?.type === 'AUTO_BACKUP'
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
              </View>

              <View>
                <Label label="Repeat Password" description="Please enter the password again." />
                <FormPasswordInput name="passwordConfirmation" testID={CreateNewWalletSelectors.repeatPasswordInput} />
              </View>

              <View style={styles.checkboxContainer} testID={CreateNewWalletSelectors.useBiometricsToUnlockCheckBox}>
                <FormBiometryCheckbox name="useBiometry" />
              </View>

              <AnalyticsField enabled={values.analytics} testID={CreateNewWalletSelectors.analyticsCheckbox} />
              <Divider size={formatSize(24)} />
              <ViewAdsField enabled={values.viewAds} testID={CreateNewWalletSelectors.viewAdsCheckbox} />
            </View>

            <View onLayout={event => handleLayoutChange('acceptTerms', event.nativeEvent.layout.y)}>
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
              onPress={() => {
                if (Boolean(errors.password)) {
                  refScrollView.current?.scrollTo({
                    x: 0,
                    y: fieldsPositions.password,
                    animated: true
                  });
                }
                if (Boolean(errors.acceptTerms)) {
                  refScrollView.current?.scrollTo({
                    x: 0,
                    y: fieldsPositions.acceptTerms,
                    animated: true
                  });
                }
                if (isValid) {
                  submitForm();
                }
              }}
              testID={CreateNewWalletSelectors.createButton}
            />
            <InsetSubstitute type="bottom" />
          </View>
        </>
      )}
    </Formik>
  );
};
