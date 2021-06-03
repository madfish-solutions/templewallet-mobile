import { Formik } from 'formik';
import React from 'react';
import { Text, View } from 'react-native';

import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLink } from '../../components/button/button-link/button-link';
import { Divider } from '../../components/divider/divider';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { Label } from '../../components/label/label';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { WelcomeHeader } from '../../components/welcome-header/welcome-header';
import { WelcomeLogo } from '../../components/welcome-logo/welcome-logo';
import { FormPasswordInput } from '../../form/form-password-input';
import { useResetDataHandler } from '../../hooks/use-reset-data-handler.hook';
import { useAppLock } from '../../shelter/use-app-lock.hook';
import { formatSize } from '../../styles/format-size';
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

  const onSubmit = ({ password }: EnterPasswordFormValues) => unlock(password);

  return (
    <ScreenContainer style={styles.root} isFullScreenMode={true}>
      <WelcomeHeader />
      <View style={styles.imageView}>
        <WelcomeLogo />
      </View>

      <View>
        <Formik
          initialValues={enterPasswordInitialValues}
          validationSchema={enterPasswordValidationSchema}
          onSubmit={onSubmit}>
          {({ submitForm, isValid }) => (
            <View>
              <Label label="Password" description="A password is used to protect the wallet." />
              <FormPasswordInput name="password" />

              <ButtonLargePrimary
                title="Unlock"
                disabled={!isValid}
                marginTop={formatSize(8)}
                marginBottom={formatSize(24)}
                onPress={submitForm}
              />
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
