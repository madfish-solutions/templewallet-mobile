import React from 'react';
import { boolean, object, SchemaOf, string } from 'yup';
import { Button, Text, View } from 'react-native';
import { Formik } from 'formik';

import { ScreenContainer } from '../../components/screen-container/screen-container';
import { ImportAccountStyles } from './import-account.styles';
import { FormTextInput } from '../../form/form-text-input';
import { FormCheckbox } from '../../form/form-checkbox';

type FormValues = {
  seedPhrase: string;
  password: string;
  passwordConfirmation: string;
  acceptTerms: boolean;
};

const validationSchema: SchemaOf<FormValues> = object().shape({
  seedPhrase: string().required(),
  password: string().required(),
  passwordConfirmation: string().required(),
  acceptTerms: boolean()
    .required('The terms and conditions must be accepted.')
    .oneOf([true], 'The terms and conditions must be accepted.')
});

const initialValues: FormValues = {
  seedPhrase: '',
  password: '',
  passwordConfirmation: '',
  acceptTerms: false
};

export const ImportAccount = () => {
  const onSubmit = (data: FormValues) => {
    console.log('submitted', data);
  };

  return (
    <ScreenContainer>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ handleSubmit }) => (
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
              <Button title="Import" onPress={handleSubmit} />
            </View>
          </>
        )}
      </Formik>
    </ScreenContainer>
  );
};
