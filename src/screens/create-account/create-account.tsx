import React, { useEffect } from 'react';
import { Button, Text, View } from 'react-native';
import { Formik } from 'formik';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { ImportAccountStyles } from '../import-account/import-account.styles';
import { FormTextInput } from '../../form/form-text-input';
import { FormCheckbox } from '../../form/form-checkbox';
import { useWalletSelector } from '../../store/wallet/wallet-selectors';
import { useDispatch } from 'react-redux';
import { createWalletActions } from '../../store/wallet/wallet-actions';
import {
  CreateAccountFormValues,
  createAccountInitialValues,
  createAccountValidationSchema
} from './create-account.form';

export const CreateAccount = () => {
  const dispatch = useDispatch();
  const walletState = useWalletSelector();

  useEffect(() => console.log(walletState), [walletState]);

  const onSubmit = (data: CreateAccountFormValues) => {
    dispatch(createWalletActions.submit(data.password));
  };

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

            <View>
              <Button title="Create" onPress={submitForm} />
            </View>
          </>
        )}
      </Formik>
    </ScreenContainer>
  );
};
