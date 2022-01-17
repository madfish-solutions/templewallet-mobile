import { Formik } from 'formik';
import React from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { useBiometryAvailability } from '../../biometry/use-biometry-availability.hook';
import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLink } from '../../components/button/button-link/button-link';
import { ButtonSmallSecondary } from '../../components/button/button-small/button-small-secondary/button-small-secondary';
import { Divider } from '../../components/divider/divider';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { TouchableIcon } from '../../components/icon/touchable-icon/touchable-icon';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { Label } from '../../components/label/label';
import { Quote } from '../../components/quote/quote';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { HIDE_SPLASH_SCREEN_TIMEOUT } from '../../config/animation';
import { FormPasswordInput } from '../../form/form-password-input';
import { useDelayedEffect } from '../../hooks/use-delayed-effect.hook';
import { useResetDataHandler } from '../../hooks/use-reset-data-handler.hook';
import { useAppLock } from '../../shelter/use-app-lock.hook';
import { useShelter } from '../../shelter/use-shelter.hook';
import { rootStateResetAction } from '../../store/root-state.actions';
import { useBiometricsEnabledSelector } from '../../store/settings/settings-selectors';
import { formatSize } from '../../styles/format-size';
import { ToastProvider } from '../../toast/toast-provider';
import { isDefined } from '../../utils/is-defined';
import {
  EnterPasswordFormValues,
  enterPasswordInitialValues,
  enterPasswordValidationSchema
} from './enter-password.form';
import { useEnterPasswordStyles } from './enter-password.styles';

export const EnterPassword = () => {
  const styles = useEnterPasswordStyles();

  const { biometryType } = useBiometryAvailability();
  const { unlock, unlockWithBiometry } = useAppLock();
  const handleResetDataButtonPress = useResetDataHandler();

  const dispatch = useDispatch();
  const { importWallet } = useShelter();
  const fillStorage = () => {
    dispatch(rootStateResetAction.submit());
    const getEnv = (key: string): string => process.env[key] ?? '';

    const appPassword = getEnv('E2E_APP_PASSWORD');
    const seedPhrase = getEnv('E2E_SEED_PHRASE');
    importWallet({
      password: appPassword,
      seedPhrase: seedPhrase
    });
    unlock(appPassword);
  };

  const biometricsEnabled = useBiometricsEnabledSelector();

  const isBiometryAvailable = isDefined(biometryType) && biometricsEnabled;
  const biometryIconName = biometryType === 'FaceID' ? IconNameEnum.FaceId : IconNameEnum.TouchId;

  const onSubmit = ({ password }: EnterPasswordFormValues) => unlock(password);

  useDelayedEffect(HIDE_SPLASH_SCREEN_TIMEOUT, () => void (isBiometryAvailable && unlockWithBiometry()), [
    isBiometryAvailable
  ]);

  return (
    <ScreenContainer style={styles.root} isFullScreenMode={true}>
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
                  <FormPasswordInput name="password" />
                </View>
                {isBiometryAvailable && (
                  <>
                    <Divider size={formatSize(16)} />
                    <View>
                      <Divider size={formatSize(4)} />
                      <TouchableIcon name={biometryIconName} size={formatSize(40)} onPress={unlockWithBiometry} />
                    </View>
                  </>
                )}
              </View>

              <Divider size={formatSize(8)} />
              <ButtonLargePrimary title="Unlock" disabled={!isValid} onPress={submitForm} />
              <Divider />
            </View>
          )}
        </Formik>
        <Text style={styles.bottomText}>Having troubles?</Text>
        <Divider size={formatSize(4)} />
        <ButtonLink title="Erase Data" onPress={handleResetDataButtonPress} />
        {process.env.NODE_ENV === 'development' && (
          <View>
            {/* <Button onPress={() => resetStorage()} testID="resetStorageBtn">
                    <Text>Reset storage</Text>
                  </Button> */}
            <ButtonSmallSecondary title={'fill storage'} onPress={() => fillStorage()} testID="fillStorageButton" />
          </View>
        )}
        <InsetSubstitute type="bottom" />
      </View>
      <ToastProvider />
    </ScreenContainer>
  );
};
