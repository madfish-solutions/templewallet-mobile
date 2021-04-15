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

export const EnterPassword = () => {
  const { unlock } = useAppLock();

  const onSubmit = ({ password }: EnterPasswordFormValues) => {
    unlock(password);
  };

  return (
    <View style={EnterPasswordStyles.root}>
      <ScreenContainer hasBackButton={false}>
        <Formik
          initialValues={enterPasswordInitialValues}
          validationSchema={enterPasswordValidationSchema}
          onSubmit={onSubmit}>
          {({ submitForm }) => (
            <>
              <Text>Password</Text>
              <FormTextInput name="password" />

              <View>
                <Button title="Unlock" onPress={submitForm} />
              </View>
            </>
          )}
        </Formik>
      </ScreenContainer>
    </View>
  );
};
