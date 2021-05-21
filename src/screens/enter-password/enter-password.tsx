import { Formik } from 'formik';
import React from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';

import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { Label } from '../../components/label/label';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { WelcomeHeader } from '../../components/welcome-header/welcome-header';
import { WelcomeLogo } from '../../components/welcome-logo/welcome-logo';
import { FormPasswordInput } from '../../form/form-password-input';
import { useAppLock } from '../../shelter/use-app-lock.hook';
import { formatSize } from '../../styles/format-size';
import { EraseDataButton } from '../settings/erase-data-button/erase-data-button';
import {
  EnterPasswordFormValues,
  enterPasswordInitialValues,
  enterPasswordValidationSchema
} from './enter-password.form';
import { useEnterPasswordStyles } from './enter-password.styles';

export const EnterPassword = () => {
  const styles = useEnterPasswordStyles();
  const { unlock } = useAppLock();
  const onSubmit = ({ password }: EnterPasswordFormValues) => unlock(password);

  return (
    <ScreenContainer isFullScreenMode={true}>
      <WelcomeHeader />
      <View style={styles.imageView}>
        <WelcomeLogo />
      </View>
      <Formik
        initialValues={enterPasswordInitialValues}
        validationSchema={enterPasswordValidationSchema}
        onSubmit={onSubmit}>
        {({ submitForm, isValid }) => (
          <KeyboardAvoidingView style={styles.formikView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <Label label="Password" description="A password is used to protect the wallet." />
            <FormPasswordInput name="password" />

            <ButtonLargePrimary
              title="Unlock"
              disabled={!isValid}
              marginTop={formatSize(8)}
              marginBottom={formatSize(24)}
              onPress={submitForm}
            />
          </KeyboardAvoidingView>
        )}
      </Formik>
      <View style={styles.bottomView}>
        <Label description="Having troubles?" />
        <EraseDataButton />
        <InsetSubstitute type="bottom" />
      </View>
    </ScreenContainer>
  );
};
