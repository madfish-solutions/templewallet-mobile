import { Formik } from 'formik';
import React from 'react';
import { Button, Text } from 'react-native';

import { FormTextInput } from '../../form/form-text-input';
import {
  CreateHdAccountFormValues,
  createHdAccountInitialValues,
  createHdAccountValidationSchema
} from './create-hd-account.form';

export const CreateHdAccount = () => {
  const onSubmit = ({ name }: CreateHdAccountFormValues) => console.log(name);

  return (
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
  );
};
