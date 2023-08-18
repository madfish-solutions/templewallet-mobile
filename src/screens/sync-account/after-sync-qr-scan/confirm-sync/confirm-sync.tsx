import { Formik } from 'formik';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { ViewAdsField } from 'src/screens/create-new-wallet/view-ads-field';

import { ButtonLargePrimary } from '../../../../components/button/button-large/button-large-primary/button-large-primary';
import { CheckboxLabel } from '../../../../components/checkbox-description/checkbox-label';
import { Disclaimer } from '../../../../components/disclaimer/disclaimer';
import { Divider } from '../../../../components/divider/divider';
import { HeaderBackButton } from '../../../../components/header/header-back-button/header-back-button';
import { HeaderTitle } from '../../../../components/header/header-title/header-title';
import { useNavigationSetOptions } from '../../../../components/header/use-navigation-set-options.hook';
import { InsetSubstitute } from '../../../../components/inset-substitute/inset-substitute';
import { Label } from '../../../../components/label/label';
import { ScreenContainer } from '../../../../components/screen-container/screen-container';
import { TextLink } from '../../../../components/text-link/text-link';
import { MAX_PASSWORD_ATTEMPTS } from '../../../../config/security';
import { analyticsCollecting, privacyPolicy, termsOfUse } from '../../../../config/socials';
import { FormBiometryCheckbox } from '../../../../form/form-biometry-checkbox/form-biometry-checkbox';
import { FormCheckbox } from '../../../../form/form-checkbox';
import { FormPasswordInput } from '../../../../form/form-password-input';
import { usePasswordLock } from '../../../../hooks/use-password-lock.hook';
import { formatSize } from '../../../../styles/format-size';
import { useSetPasswordScreensCommonStyles } from '../../../../styles/set-password-screens-common-styles';
import { ConfirmSyncFormValues, ConfirmSyncInitialValues, ConfirmSyncValidationSchema } from './confirm-sync.form';
import { ConfirmSyncSelectors } from './confirm-sync.selectors';

interface ConfirmSyncProps {
  onSubmit: (formValues: ConfirmSyncFormValues) => void;
}

export const ConfirmSync: FC<ConfirmSyncProps> = ({ onSubmit }) => {
  const styles = useSetPasswordScreensCommonStyles();

  const { isDisabled, timeleft } = usePasswordLock();

  useNavigationSetOptions(
    {
      headerLeft: () => <HeaderBackButton />,
      headerTitle: () => <HeaderTitle title="Confirm Sync" />
    },
    []
  );

  return (
    <Formik initialValues={ConfirmSyncInitialValues} validationSchema={ConfirmSyncValidationSchema} onSubmit={onSubmit}>
      {({ submitForm, isValid, values }) => (
        <>
          <ScreenContainer isFullScreenMode={true}>
            <View>
              <Divider size={formatSize(12)} />
              <Label label="Password" description="The same password is used to unlock your extension." />
              <FormPasswordInput
                name="password"
                {...(isDisabled && {
                  error: `You have entered the wrong password ${MAX_PASSWORD_ATTEMPTS} times. Your wallet is being blocked for ${timeleft}`
                })}
                testID={ConfirmSyncSelectors.passwordInput}
              />

              <View style={styles.checkboxContainer}>
                <FormCheckbox name="usePrevPassword" testID={ConfirmSyncSelectors.useAsAppPasswordCheckbox}>
                  <Divider size={formatSize(8)} />
                  <Text style={styles.checkboxText}>Use as App Password</Text>
                </FormCheckbox>
              </View>

              <View style={styles.checkboxContainer}>
                <FormBiometryCheckbox name="useBiometry" />
              </View>

              <View style={[styles.checkboxContainer, styles.removeMargin]}>
                <FormCheckbox name="analytics" testID={ConfirmSyncSelectors.analyticsCheckbox}>
                  <Divider size={formatSize(8)} />
                  <Text style={styles.checkboxText}>Analytics</Text>
                </FormCheckbox>
              </View>
              <CheckboxLabel>
                I agree to the <TextLink url={analyticsCollecting}>anonymous information collecting</TextLink>
              </CheckboxLabel>

              <Divider size={formatSize(24)} />

              <ViewAdsField enabled={values.viewAds} testID={ConfirmSyncSelectors.viewAdsCheckbox} />

              {values.usePrevPassword === true && (
                <>
                  <Divider size={formatSize(8)} />
                  <Disclaimer
                    texts={['The password to unlock your mobile temple wallet is the same you set for the extension.']}
                  />
                  <Divider size={formatSize(8)} />
                </>
              )}
            </View>
            <View>
              <View style={styles.checkboxContainer}>
                <FormCheckbox name="acceptTerms" testID={ConfirmSyncSelectors.acceptTermsCheckbox}>
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
          <View style={[styles.marginTopAuto, styles.fixedButtonContainer]}>
            <ButtonLargePrimary
              title={values.usePrevPassword === true ? 'Sync' : 'Next'}
              disabled={!isValid || isDisabled}
              onPress={submitForm}
              testID={
                values.usePrevPassword === true ? ConfirmSyncSelectors.syncButton : ConfirmSyncSelectors.nextButton
              }
            />
            <InsetSubstitute type="bottom" />
          </View>
        </>
      )}
    </Formik>
  );
};
