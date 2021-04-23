import { Formik } from 'formik';
import React from 'react';
import { Button, Text } from 'react-native';

import { ScreenContainer } from '../../components/screen-container/screen-container';
import { FormCheckbox } from '../../form/form-checkbox';
import { FormTextInput } from '../../form/form-text-input';
import { useShelter } from '../../shelter/use-shelter.hook';
import { ImportAccountStyles } from '../import-account/import-account.styles';
import {
  CreateAccountFormValues,
  createAccountInitialValues,
  createAccountValidationSchema
} from './create-account.form';

export const CreateAccount = () => {
  const { createWallet } = useShelter();

  const onSubmit = (data: CreateAccountFormValues) => createWallet(data.password);

  return (
    <ScreenContainer>
      <Formik
        initialValues={createAccountInitialValues}
        validationSchema={createAccountValidationSchema}
        onSubmit={onSubmit}>
        {({ submitForm }) => (
          <>
            <Text style={ImportAccountStyles.labelText}>Password</Text>
            <FormTextInput name="password" />

            <Text style={ImportAccountStyles.labelText}>Password confirmation</Text>
            <FormTextInput name="passwordConfirmation" />

            <Text style={ImportAccountStyles.labelText}>Accept Terms</Text>
            <FormCheckbox name="acceptTerms" />

            <Button title="Create" onPress={submitForm} />
          </>
        )}
      </Formik>
    </ScreenContainer>
  );
};
