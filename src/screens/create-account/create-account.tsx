import { Formik } from 'formik';
import React from 'react';
import { Text } from 'react-native';

import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
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
        {({ submitForm, isValid }) => (
          <>
            <Text style={ImportAccountStyles.labelText}>Password</Text>
            <FormTextInput type="password" name="password" />

            <Text style={ImportAccountStyles.labelText}>Password confirmation</Text>
            <FormTextInput type="password" name="passwordConfirmation" />

            <Text style={ImportAccountStyles.labelText}>Accept Terms</Text>
            <FormCheckbox name="acceptTerms" />

            <ButtonLargePrimary title="Create" disabled={!isValid} onPress={submitForm} />
          </>
        )}
      </Formik>
    </ScreenContainer>
  );
};
