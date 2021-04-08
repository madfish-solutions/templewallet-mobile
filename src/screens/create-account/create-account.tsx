import React from 'react';
import { Button, Text, View } from 'react-native';
import { boolean, object, SchemaOf, string } from 'yup';
import { createWallet } from '../../utils/wallet.util';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { Formik } from 'formik';
import { ImportAccountStyles } from '../import-account/import-account.styles';
import { FormTextInput } from '../../form/form-text-input';
import { FormCheckbox } from '../../form/form-checkbox';

type FormValues = {
  password: string;
  passwordConfirmation: string;
  acceptTerms: boolean;
};

const validationSchema: SchemaOf<FormValues> = object().shape({
  password: string().required(),
  passwordConfirmation: string().required(),
  acceptTerms: boolean()
    .required('The terms and conditions must be accepted.')
    .oneOf([true], 'The terms and conditions must be accepted.')
});

const initialValues: FormValues = {
  password: '',
  passwordConfirmation: '',
  acceptTerms: false
};

export const CreateAccount = () => {
  const onSubmit = (data: FormValues) => {
    createWallet(data.password);
  };

  return (
    <ScreenContainer>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ handleSubmit }) => (
          <>
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
