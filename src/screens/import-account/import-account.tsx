import React from 'react';
import { Button, Text, View } from 'react-native';
import { Formik } from 'formik';

import { ScreenContainer } from '../../components/screen-container/screen-container';
import { ImportAccountStyles } from './import-account.styles';
import { FormTextInput } from '../../form/form-text-input';
import { FormCheckbox } from '../../form/form-checkbox';
import {
  ImportAccountFormValues,
  importAccountInitialValues,
  importAccountValidationSchema
} from './import-account.form';
import { useShelter } from '../../shelter/shelter';

export const ImportAccount = () => {
  const { importWallet } = useShelter();

  const onSubmit = ({ seedPhrase, password }: ImportAccountFormValues) => {
    importWallet(seedPhrase, password);
  };

  return (
    <ScreenContainer>
      <Formik
        initialValues={importAccountInitialValues}
        validationSchema={importAccountValidationSchema}
        onSubmit={onSubmit}>
        {({ submitForm }) => (
          <>
            <Text style={ImportAccountStyles.labelText}>Seed Phrase</Text>
            <FormTextInput name="seedPhrase" multiline={true} />

            <Text style={ImportAccountStyles.labelText}>Password</Text>
            <FormTextInput name="password" />

            <Text style={ImportAccountStyles.labelText}>Password confirmation</Text>
            <FormTextInput name="passwordConfirmation" />

            <Text style={ImportAccountStyles.labelText}>Accept Terms</Text>
            <FormCheckbox name="acceptTerms" />

            <View>
              <Button title="Import" onPress={submitForm} />
            </View>
          </>
        )}
      </Formik>
    </ScreenContainer>
  );
};
