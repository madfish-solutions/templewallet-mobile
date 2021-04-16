import React from 'react';
import { Button, Text, View } from 'react-native';
import { Formik } from 'formik';

import { EnterPasswordStyles } from './enter-password.styles';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { FormTextInput } from '../../form/form-text-input';
import {
  EnterPasswordFormValues,
  enterPasswordInitialValues,
  enterPasswordValidationSchema
} from './enter-password.form';
import { useAppLock } from '../../shelter/use-app-lock.hook';
import { EraseDataButton } from '../settings/erase-data-button/erase-data-button';

export const EnterPassword = () => {
  const { unlock } = useAppLock();

  const onSubmit = ({ password }: EnterPasswordFormValues) => unlock(password);

  return (
    <View style={EnterPasswordStyles.root}>
      <ScreenContainer hasBackButton={false}>
        <Formik
          initialValues={enterPasswordInitialValues}
          validationSchema={enterPasswordValidationSchema}
          onSubmit={onSubmit}>
          {({ submitForm }) => (
            <>
              <Text>Your wallet have been locked</Text>
              <Text>{'Enter a password to unlock it\n\n'}</Text>

              <Text>Password</Text>
              <FormTextInput name="password" />

              <Button title="Unlock" onPress={submitForm} />
              <EraseDataButton />
            </>
          )}
        </Formik>
      </ScreenContainer>
    </View>
  );
};
