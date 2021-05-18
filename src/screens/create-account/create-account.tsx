import { Formik } from 'formik';
import React from 'react';
import { Text } from 'react-native';

import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { FormCheckbox } from '../../form/form-checkbox';
import { FormMnemonicInput } from '../../form/form-mnemonic-input';
import { FormPasswordInput } from '../../form/form-password-input';
import { useShelter } from '../../shelter/use-shelter.hook';
import { ImportAccountStyles } from '../import-account/import-account.styles';
import {
  CreateAccountFormValues,
  createAccountInitialValues,
  createAccountValidationSchema
} from './create-account.form';

export const CreateAccount = () => {
  const { importWallet } = useShelter();

  const onSubmit = (data: CreateAccountFormValues) => importWallet(data.seedPhrase, data.password);

  return (
    <ScreenContainer>
      <Formik
        initialValues={createAccountInitialValues}
        validationSchema={createAccountValidationSchema}
        onSubmit={onSubmit}>
        {({ submitForm, isValid }) => (
          <>
            <Text style={ImportAccountStyles.labelText}>Seed Phrase</Text>
            <FormMnemonicInput name="seedPhrase" />

            <Text style={ImportAccountStyles.labelText}>Password</Text>
            <FormPasswordInput name="password" />

            <Text style={ImportAccountStyles.labelText}>Password confirmation</Text>
            <FormPasswordInput name="passwordConfirmation" />

            <Text style={ImportAccountStyles.labelText}>Accept Terms</Text>
            <FormCheckbox name="acceptTerms" />

            <ButtonLargePrimary title="Create" disabled={!isValid} onPress={submitForm} />
          </>
        )}
      </Formik>
    </ScreenContainer>
  );
};
