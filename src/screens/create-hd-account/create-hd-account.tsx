import { Formik } from 'formik';
import React from 'react';
import { Button, Text } from 'react-native';

import { ScreenContainer } from '../../components/screen-container/screen-container';
import { FormTextInput } from '../../form/form-text-input';
import { useShelter } from '../../shelter/use-shelter.hook';
import {
  CreateHdAccountFormValues,
  createHdAccountInitialValues,
  createHdAccountValidationSchema
} from './create-hd-account.form';

export const CreateHdAccount = () => {
  const { createHdAccount } = useShelter();

  const onSubmit = ({ name }: CreateHdAccountFormValues) => createHdAccount(name);

  return (
    <ScreenContainer>
      <Formik
        initialValues={createHdAccountInitialValues}
        validationSchema={createHdAccountValidationSchema}
        onSubmit={onSubmit}>
        {({ submitForm }) => (
          <>
            <Text>Account name:</Text>
            <FormTextInput name="name" />

            <Button title="Create" onPress={submitForm} />
          </>
        )}
      </Formik>
    </ScreenContainer>
  );
};
