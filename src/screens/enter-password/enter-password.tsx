import { Formik } from 'formik';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import * as Keychain from 'react-native-keychain';

import { Button } from '../../components/button/button';
import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLink } from '../../components/button/button-link/button-link';
import { Divider } from '../../components/divider/divider';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { Label } from '../../components/label/label';
import { Quote } from '../../components/quote/quote';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { transparent } from '../../config/styles';
import { FormPasswordInput } from '../../form/form-password-input';
import { useBiometryAvailability } from '../../hooks/use-biometry-availability.hook';
import { useResetDataHandler } from '../../hooks/use-reset-data-handler.hook';
import { useAppLock } from '../../shelter/use-app-lock.hook';
import { useBiometricsEnabledSelector } from '../../store/settings/settings-selectors';
import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';
import { isDefined } from '../../utils/is-defined';
import {
  EnterPasswordFormValues,
  enterPasswordInitialValues,
  enterPasswordValidationSchema
} from './enter-password.form';
import { useEnterPasswordStyles } from './enter-password.styles';

export const EnterPassword = () => {
  const biometricsEnabled = useBiometricsEnabledSelector();
  const colors = useColors();
  const styles = useEnterPasswordStyles();
  const { activeBiometryType } = useBiometryAvailability();
  const { unlock, unlockWithBiometry } = useAppLock();
  const handleResetDataButtonPress = useResetDataHandler();

  const shouldEnableUnlockWithBiometry = isDefined(activeBiometryType) && biometricsEnabled;
  const onSubmit = ({ password }: EnterPasswordFormValues) => unlock(password);
  const faceBiometryAvailable =
    activeBiometryType === Keychain.BIOMETRY_TYPE.FACE || activeBiometryType === Keychain.BIOMETRY_TYPE.FACE_ID;

  const biometryButtonStyleConfig = {
    iconStyle: { size: formatSize(40), marginRight: 0 },
    containerStyle: { height: formatSize(40), borderRadius: 0 },
    activeColorConfig: { titleColor: colors.orange, backgroundColor: transparent }
  };

  useEffect(() => {
    if (shouldEnableUnlockWithBiometry) {
      unlockWithBiometry();
    }
  }, [activeBiometryType, biometricsEnabled]);

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
          onSubmit={onSubmit}>
          {({ submitForm, isValid }) => (
            <View>
              <Label label="Password" description="A password is used to protect the wallet." />
              <View style={styles.passwordInputSection}>
                <View style={styles.passwordInputWrapper}>
                  <FormPasswordInput name="password" />
                </View>
                {shouldEnableUnlockWithBiometry && (
                  <Button
                    onPress={unlockWithBiometry}
                    iconName={faceBiometryAvailable ? IconNameEnum.FaceId : IconNameEnum.TouchId}
                    marginLeft={formatSize(16)}
                    marginTop={formatSize(6)}
                    styleConfig={biometryButtonStyleConfig}
                  />
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
        <InsetSubstitute type="bottom" />
      </View>
    </ScreenContainer>
  );
};
