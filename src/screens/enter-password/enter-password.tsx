import { Formik } from 'formik';
import React, { useEffect, useMemo } from 'react';
import { ImageBackground, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { ABTestGroup } from 'src/apis/temple-wallet';
import { useBiometryAvailability } from 'src/biometry/use-biometry-availability.hook';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLink } from 'src/components/button/button-link/button-link';
import { Divider } from 'src/components/divider/divider';
import ChristmasBgDark from 'src/components/icon/assets/background/christmas-bg-dark.png';
import ChristmasBgLight from 'src/components/icon/assets/background/christmas-bg-light.png';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { LogoWithText } from 'src/components/icon/logo-with-text';
import { TouchableIcon } from 'src/components/icon/touchable-icon/touchable-icon';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { Label } from 'src/components/label/label';
import { Quote } from 'src/components/quote/quote';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { MAX_PASSWORD_ATTEMPTS } from 'src/config/security';
import { isIOS } from 'src/config/system';
import { FormPasswordInput } from 'src/form/form-password-input';
import { useAtBootsplash } from 'src/hooks/use-hide-bootsplash';
import { usePasswordLock } from 'src/hooks/use-password-lock.hook';
import { useResetDataHandler } from 'src/hooks/use-reset-data-handler.hook';
import { ThemesEnum } from 'src/interfaces/theme.enum';
import { OverlayEnum } from 'src/navigator/enums/overlay.enum';
import { useAppLock } from 'src/shelter/app-lock/app-lock';
import { getUserTestingGroupNameActions } from 'src/store/ab-testing/ab-testing-actions';
import { useUserTestingGroupNameSelector } from 'src/store/ab-testing/ab-testing-selectors';
import { useBiometricsEnabledSelector, useThemeSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { ToastProvider } from 'src/toast/toast-provider';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { isDefined } from 'src/utils/is-defined';

import {
  EnterPasswordFormValues,
  enterPasswordInitialValues,
  enterPasswordValidationSchema
} from './enter-password.form';
import { EnterPasswordSelectors } from './enter-password.selectors';
import { useEnterPasswordStyles } from './enter-password.styles';

export const EnterPassword = () => {
  const theme = useThemeSelector();
  const styles = useEnterPasswordStyles();
  const groupName = useUserTestingGroupNameSelector();
  const dispatch = useDispatch();

  const atBootsplash = useAtBootsplash();

  const { unlock, unlockWithBiometry } = useAppLock();

  const { biometryType } = useBiometryAvailability();
  const handleResetDataButtonPress = useResetDataHandler();
  const { isDisabled, timeleft } = usePasswordLock();

  const biometricsEnabled = useBiometricsEnabledSelector();

  const isBiometryAvailable = isDefined(biometryType) && biometricsEnabled;
  const biometryIconName = biometryType === 'FaceID' ? IconNameEnum.FaceId : IconNameEnum.TouchId;

  const christmasBgSource = useMemo(() => (theme === ThemesEnum.dark ? ChristmasBgDark : ChristmasBgLight), [theme]);

  const onSubmit = ({ password }: EnterPasswordFormValues) => void (!isDisabled && unlock(password));

  usePageAnalytic(OverlayEnum.EnterPassword);

  useEffect(
    () => void (!atBootsplash && isBiometryAvailable && unlockWithBiometry()),
    [isBiometryAvailable, atBootsplash]
  );

  useEffect(() => {
    if (groupName === ABTestGroup.Unknown) {
      dispatch(getUserTestingGroupNameActions.submit());
    }
  }, [dispatch, groupName]);

  return (
    <ScreenContainer
      style={styles.root}
      contentContainerStyle={styles.scrollViewContentContainer}
      keyboardBehavior="padding"
      isFullScreenMode={true}
    >
      <ImageBackground resizeMode={isIOS ? 'contain' : 'cover'} source={christmasBgSource} style={styles.bg}>
        <InsetSubstitute />

        <View style={styles.imageView}>
          <LogoWithText width={formatSize(248)} height={formatSize(104)} style={styles.logo} />
        </View>

        <Divider size={formatSize(121)} />

        <Quote
          quote="The only function of economic forecasting is to make astrology look more respectable."
          author="John Kenneth Galbraith"
        />
      </ImageBackground>

      <Divider />

      <View style={styles.footer}>
        <Formik
          initialValues={enterPasswordInitialValues}
          validationSchema={enterPasswordValidationSchema}
          onSubmit={onSubmit}
        >
          {({ submitForm, isValid }) => (
            <View>
              <Label label="Password" description="A password is used to protect the wallet." />
              <View style={styles.passwordInputSection}>
                <View style={styles.passwordInputWrapper}>
                  <FormPasswordInput
                    name="password"
                    {...(isDisabled && {
                      error: `You have entered the wrong password ${MAX_PASSWORD_ATTEMPTS} times. Your wallet is being blocked for ${timeleft}`
                    })}
                    testID={EnterPasswordSelectors.passwordInput}
                  />
                </View>
                {isBiometryAvailable && (
                  <View style={styles.passwordBiometry}>
                    <Divider size={formatSize(16)} />
                    <View>
                      <Divider size={formatSize(4)} />
                      <TouchableIcon
                        name={biometryIconName}
                        size={formatSize(40)}
                        onPress={unlockWithBiometry}
                        testID={EnterPasswordSelectors.unlockWithBiometry}
                      />
                    </View>
                  </View>
                )}
              </View>

              <Divider size={formatSize(8)} />
              <ButtonLargePrimary
                title="Unlock"
                disabled={!isValid || isDisabled}
                onPress={submitForm}
                testID={EnterPasswordSelectors.unlockButton}
              />
              <Divider />
            </View>
          )}
        </Formik>
        <Text style={styles.bottomText}>Having troubles?</Text>
        <Divider size={formatSize(4)} />
        <ButtonLink
          title="Reset a wallet"
          onPress={handleResetDataButtonPress}
          testID={EnterPasswordSelectors.eraseDataButtonLink}
        />
        <InsetSubstitute type="bottom" />
      </View>
      <ToastProvider />
    </ScreenContainer>
  );
};
