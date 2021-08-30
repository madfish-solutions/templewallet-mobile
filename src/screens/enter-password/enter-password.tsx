import { Formik } from 'formik';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';

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
import { isAndroid } from '../../config/system';
import { FormPasswordInput } from '../../form/form-password-input';
import { useResetDataHandler } from '../../hooks/use-reset-data-handler.hook';
import { useAppLock } from '../../shelter/use-app-lock.hook';
import { useBiometricsEnabledSelector } from '../../store/settings/settings-selectors';
import { formatSize } from '../../styles/format-size';
import { isDefined } from '../../utils/is-defined';
import {
  EnterPasswordFormValues,
  enterPasswordInitialValues,
  enterPasswordValidationSchema
} from './enter-password.form';
import { useEnterPasswordStyles } from './enter-password.styles';
import { useDelayedEffect } from '../../hooks/use-delayed-effect.hook';

export const EnterPassword = () => {
  const styles = useEnterPasswordStyles();

  const { biometryType } = useBiometryAvailability();
  const { unlock, unlockWithBiometry } = useAppLock();
  const handleResetDataButtonPress = useResetDataHandler();

  const biometricsEnabled = useBiometricsEnabledSelector();

  const isBiometryAvailable = isDefined(biometryType) && biometricsEnabled;
  const biometryIconName = biometryType === 'FaceID' ? IconNameEnum.FaceId : IconNameEnum.TouchId;

  const onSubmit = ({ password }: EnterPasswordFormValues) => unlock(password);

  useDelayedEffect(() => void (isBiometryAvailable && unlockWithBiometry()), [isBiometryAvailable]);

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
        <InsetSubstitute type="bottom" />
      </View>
    </ScreenContainer>
  );
};
