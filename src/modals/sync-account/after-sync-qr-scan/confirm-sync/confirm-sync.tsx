import { Formik } from 'formik';
import React, { memo } from 'react';
import { Text, View } from 'react-native';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from 'src/components/button/buttons-container/buttons-container';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { CheckboxLabel } from 'src/components/checkbox-description/checkbox-label';
import { Disclaimer } from 'src/components/disclaimer/disclaimer';
import { Divider } from 'src/components/divider/divider';
import { ViewAdsField } from 'src/components/fields/view-ads-field';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { TextLink } from 'src/components/text-link/text-link';
import { MAX_PASSWORD_ATTEMPTS } from 'src/config/security';
import { analyticsCollecting, privacyPolicy, termsOfUse } from 'src/config/socials';
import { FormBiometryCheckbox } from 'src/form/form-biometry-checkbox/form-biometry-checkbox';
import { FormCheckbox } from 'src/form/form-checkbox';
import { FormPasswordInput } from 'src/form/form-password-input';
import { usePasswordLock } from 'src/hooks/use-password-lock.hook';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';
import { useSetPasswordScreensCommonStyles } from 'src/styles/set-password-screens-common-styles';

import { ConfirmSyncFormValues, ConfirmSyncInitialValues, ConfirmSyncValidationSchema } from './confirm-sync.form';
import { ConfirmSyncSelectors } from './confirm-sync.selectors';

interface Props {
  onSubmit: (formValues: ConfirmSyncFormValues) => void;
}

export const ConfirmSync = memo<Props>(({ onSubmit }) => {
  const styles = useSetPasswordScreensCommonStyles();
  const { goBack } = useNavigation();

  const { isDisabled, timeleft } = usePasswordLock();

  useNavigationSetOptions(
    {
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

              <ViewAdsField name="viewAds" testID={ConfirmSyncSelectors.viewAdsCheckbox} />

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

          <ButtonsFloatingContainer>
            <ButtonsContainer style={styles.buttonsContainer}>
              <View style={styles.flex}>
                <ButtonLargeSecondary title="Back" onPress={goBack} />
              </View>
              <Divider size={formatSize(15)} />
              <View style={styles.flex}>
                <ButtonLargePrimary
                  title={values.usePrevPassword === true ? 'Sync' : 'Next'}
                  disabled={!isValid || isDisabled}
                  onPress={submitForm}
                  testID={
                    values.usePrevPassword === true ? ConfirmSyncSelectors.syncButton : ConfirmSyncSelectors.nextButton
                  }
                />
              </View>
            </ButtonsContainer>
            <InsetSubstitute type="bottom" />
          </ButtonsFloatingContainer>
        </>
      )}
    </Formik>
  );
});
