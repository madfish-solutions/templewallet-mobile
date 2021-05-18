import { Formik } from 'formik';
import React from 'react';
import { Button, Text } from 'react-native';

import { ScreenContainer } from '../../components/screen-container/screen-container';
import { FormCheckbox } from '../../form/form-checkbox';
import { FormMnemonicInput } from '../../form/form-mnemonic-input';
import { FormPasswordInput } from '../../form/form-password-input';
import { useShelter } from '../../shelter/use-shelter.hook';
import {
  ImportAccountFormValues,
  importAccountInitialValues,
  importAccountValidationSchema
} from './import-account.form';
import { ImportAccountStyles } from './import-account.styles';

export const ImportAccount = () => {
  const { importWallet } = useShelter();

  const onSubmit = ({ seedPhrase, password }: ImportAccountFormValues) => importWallet(seedPhrase, password);

  return (
    <ScreenContainer>
      <Formik
        initialValues={importAccountInitialValues}
        validationSchema={importAccountValidationSchema}
        onSubmit={onSubmit}>
        {({ submitForm }) => (
          <>
            <Text style={ImportAccountStyles.labelText}>Seed Phrase</Text>
            <FormMnemonicInput name="seedPhrase" isShowGetNew />

            <Text style={ImportAccountStyles.labelText}>Password</Text>
            <FormPasswordInput name="password" />

            <Text style={ImportAccountStyles.labelText}>Password confirmation</Text>
            <FormPasswordInput name="passwordConfirmation" />

            <Text style={ImportAccountStyles.labelText}>Accept Terms</Text>
            <FormCheckbox name="acceptTerms" />

            <Button title="Import" onPress={submitForm} />
          </>
        )}
      </Formik>
    </ScreenContainer>
  );
};
