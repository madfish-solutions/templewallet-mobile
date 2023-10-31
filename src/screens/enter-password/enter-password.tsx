import { Formik } from 'formik';
import { noop } from 'lodash-es';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { Shelter } from 'src/shelter/shelter';

import { ABTestGroup } from '../../apis/temple-wallet';
import { useBiometryAvailability } from '../../biometry/use-biometry-availability.hook';
import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLink } from '../../components/button/button-link/button-link';
import { Divider } from '../../components/divider/divider';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { TouchableIcon } from '../../components/icon/touchable-icon/touchable-icon';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { Label } from '../../components/label/label';
import { Quote } from '../../components/quote/quote';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { MAX_PASSWORD_ATTEMPTS } from '../../config/security';
import { FormPasswordInput } from '../../form/form-password-input';
import { useAtBootsplash } from '../../hooks/use-hide-bootsplash';
import { usePasswordLock } from '../../hooks/use-password-lock.hook';
import { useResetDataHandler } from '../../hooks/use-reset-data-handler.hook';
import { OverlayEnum } from '../../navigator/enums/overlay.enum';
import { useAppLock } from '../../shelter/app-lock/app-lock';
import { getUserTestingGroupNameActions } from '../../store/ab-testing/ab-testing-actions';
import { useUserTestingGroupNameSelector } from '../../store/ab-testing/ab-testing-selectors';
import { useBiometricsEnabledSelector } from '../../store/settings/settings-selectors';
import { formatSize } from '../../styles/format-size';
import { ToastProvider } from '../../toast/toast-provider';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { isDefined } from '../../utils/is-defined';
import {
  EnterPasswordFormValues,
  enterPasswordInitialValues,
  enterPasswordValidationSchema
} from './enter-password.form';
import { EnterPasswordSelectors } from './enter-password.selectors';
import { useEnterPasswordStyles } from './enter-password.styles';

export const EnterPassword = () => {
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

  const onSubmit = ({ password }: EnterPasswordFormValues) => void (!isDisabled && unlock(password));

  usePageAnalytic(OverlayEnum.EnterPassword);

  useEffect(() => {
    Shelter.shouldDoSomeMigrations()
      .then(
        shouldDoMigrations => void (!atBootsplash && isBiometryAvailable && !shouldDoMigrations && unlockWithBiometry())
      )
      .catch(noop);
  }, [isBiometryAvailable, atBootsplash, unlockWithBiometry]);

  useEffect(() => {
    if (groupName === ABTestGroup.Unknown) {
      dispatch(getUserTestingGroupNameActions.submit());
    }
  }, [dispatch, groupName]);

  return (
    <ScreenContainer style={styles.root} keyboardBehavior="padding" isFullScreenMode={true}>
      <View style={styles.imageView}>
        <InsetSubstitute />
        <Icon name={IconNameEnum.TempleLogoWithText} width={formatSize(208)} height={formatSize(64)} />
      </View>
      <Divider />
      <Quote
        quote="The only function of economic forecasting is to make astrology look more respectable."
        author="John Kenneth Galbraith"
      />
      <Divider />
      <View>
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
          title="Erase Data"
          onPress={handleResetDataButtonPress}
          testID={EnterPasswordSelectors.eraseDataButtonLink}
        />
        <InsetSubstitute type="bottom" />
      </View>
      <ToastProvider />
    </ScreenContainer>
  );
};
