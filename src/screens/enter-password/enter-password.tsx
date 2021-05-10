import { Formik } from 'formik';
import React from 'react';
import { Button, Text, View } from 'react-native';

import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { FormPasswordInput } from '../../form/form-password-input';
import { useAppLock } from '../../shelter/use-app-lock.hook';
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
    <View style={styles.root}>
      <InsetSubstitute />

      <ScreenContainer>
        <Formik
          initialValues={enterPasswordInitialValues}
          validationSchema={enterPasswordValidationSchema}
          onSubmit={onSubmit}>
          {({ submitForm }) => (
            <>
              <Text>Your wallet have been locked</Text>
              <Text>{'Enter a password to unlock it\n\n'}</Text>

              <Text>Password</Text>
              <FormPasswordInput name="password" />

              <Button title="Unlock" onPress={submitForm} />
              <EraseDataButton />
            </>
          )}
        </Formik>
      </ScreenContainer>
    </View>
  );
};
