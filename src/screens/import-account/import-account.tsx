import React from 'react';
import { boolean, object, SchemaOf, string } from 'yup';
import { Button, Text, View } from 'react-native';
import { Resolver, useForm } from 'react-hook-form';
import { useTypedController } from '@hookform/strictly-typed';

import { ScreenContainer } from '../../components/screen-container/screen-container';
import { yupResolver } from '@hookform/resolvers/yup';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { ImportAccountStyles } from './import-account.styles';
import { ErrorMessage } from '../../components/error-message/error-message';
import { FormMultilineTextInput } from '../../form/form-multiline-text-input';
import { FormTextInput } from '../../form/form-text-input';

type FormValues = {
  seedPhrase: string;
  password: string;
  passwordConfirmation: string;
  acceptTerms: boolean;
};

const schema: SchemaOf<FormValues> = object().shape({
  seedPhrase: string().required(),
  password: string().required(),
  passwordConfirmation: string().required(),
  acceptTerms: boolean()
    .required('The terms and conditions must be accepted.')
    .oneOf([true], 'The terms and conditions must be accepted.')
});

const resolver: Resolver<FormValues, object> = yupResolver(schema);

const defaultValues: FormValues = {
  seedPhrase: '',
  password: '',
  passwordConfirmation: '',
  acceptTerms: false
};

export const ImportAccount = () => {
  const { control, errors, handleSubmit } = useForm<FormValues>({
    resolver,
    defaultValues
  });
  const TypedController = useTypedController<FormValues>({ control });

  const onSubmit = (data: FormValues) => {
    console.log('submitted', data);
  };

  return (
    <ScreenContainer>
      <Text style={ImportAccountStyles.labelText}>Seed Phrase</Text>

      <TypedController name="seedPhrase" render={FormMultilineTextInput} />
      <ErrorMessage fieldError={errors.seedPhrase} />

      <Text style={ImportAccountStyles.labelText}>Password</Text>
      <TypedController name="password" render={FormTextInput} />
      <ErrorMessage fieldError={errors.password} />

      <Text style={ImportAccountStyles.labelText}>Password confirmation</Text>
      <TypedController name="passwordConfirmation" render={FormTextInput} />
      <ErrorMessage fieldError={errors.passwordConfirmation} />

      <TypedController
        name="acceptTerms"
        render={({ onChange, value }) => (
          <BouncyCheckbox text="Accept Terms" isChecked={value} onPress={newValue => onChange(newValue)} />
        )}
      />
      <ErrorMessage fieldError={errors.acceptTerms} />

      <View>
        <Button title="Import" onPress={handleSubmit(onSubmit)} />
      </View>
    </ScreenContainer>
  );
};
