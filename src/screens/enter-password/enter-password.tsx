import { Formik } from 'formik';
import React, { useState } from 'react';
import { Text, View } from 'react-native';

import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLink } from '../../components/button/button-link/button-link';
import { Divider } from '../../components/divider/divider';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { Label } from '../../components/label/label';
import { Quote } from '../../components/quote/quote';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { FormPasswordInput } from '../../form/form-password-input';
import { useResetDataHandler } from '../../hooks/use-reset-data-handler.hook';
import { useAppLock } from '../../shelter/use-app-lock.hook';
import { formatSize } from '../../styles/format-size';
import { conditionalStyle } from '../../utils/conditional-style';
import {
  EnterPasswordFormValues,
  enterPasswordInitialValues,
  enterPasswordValidationSchema
} from './enter-password.form';
import { useEnterPasswordStyles } from './enter-password.styles';

export const EnterPassword = () => {
  const styles = useEnterPasswordStyles();
  const { unlock } = useAppLock();
  const handleResetDataButtonPress = useResetDataHandler();
  const [passwordFocused, setPasswordFocused] = useState(false);

  const onSubmit = ({ password }: EnterPasswordFormValues) => unlock(password);
  const handlePasswordBlur = () => setPasswordFocused(false);
  const handlePasswordFocus = () => setPasswordFocused(true);

  return (
    <ScreenContainer style={styles.root} isFullScreenMode={true}>
      <View style={styles.imageView}>
        <Icon name={IconNameEnum.TempleLogoWithText} width={formatSize(208)} height={formatSize(64)} />
      </View>
      <View style={[styles.quoteView, conditionalStyle(passwordFocused, styles.hidden)]}>
        <Quote
          quote="The only function of economic forecasting is to make astrology look more respectable."
          author="John Kenneth Galbraith"
        />
      </View>
      {passwordFocused && <Divider size={formatSize(12)} />}
      <View>
        <Formik
          initialValues={enterPasswordInitialValues}
          validationSchema={enterPasswordValidationSchema}
          onSubmit={onSubmit}>
          {({ submitForm, isValid }) => (
            <View>
              <Label label="Password" description="A password is used to protect the wallet." />
              <FormPasswordInput name="password" onBlur={handlePasswordBlur} onFocus={handlePasswordFocus} />

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
