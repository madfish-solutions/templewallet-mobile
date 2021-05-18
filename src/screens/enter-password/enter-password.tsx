import { Formik } from 'formik';
import React from 'react';
import { View } from 'react-native';

import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { Label } from '../../components/label/label';
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
    <View style={styles.view}>
      <WelcomeHeader />
      <WelcomeLogo />
      <Formik
        initialValues={enterPasswordInitialValues}
        validationSchema={enterPasswordValidationSchema}
        onSubmit={onSubmit}>
        {({ submitForm }) => (
          <>
            <View>
              <Label label="Password" description="A password is used to protect the wallet." />
              <FormPasswordInput name="password" />
            </View>
            <View>
              <ButtonLargePrimary title="Unlock" marginBottom={formatSize(8)} onPress={() => submitForm()} />
              <EraseDataButton />
              <InsetSubstitute type="bottom" />
            </View>
          </>
        )}
      </Formik>
    </View>
  );
};
