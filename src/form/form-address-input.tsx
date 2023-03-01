import { useField } from 'formik';
import React, { FC } from 'react';

import { AddressInput } from '../components/address-input/address-input';
import { StyledTextInputProps } from '../components/styled-text-input/styled-text-input.props';
import { TestIdProps } from '../interfaces/test-id.props';
import { hasError } from '../utils/has-error';
import { ErrorMessage } from './error-message/error-message';

interface Props extends Pick<StyledTextInputProps, 'placeholder'>, TestIdProps {
  name: string;
}

export const FormAddressInput: FC<Props> = ({ name, placeholder, testID }) => {
  const [field, meta, helpers] = useField<string>(name);
  const isError = hasError(meta);

  return (
    <>
      <AddressInput
        value={field.value}
        placeholder={placeholder}
        isError={isError}
        onBlur={() => helpers.setTouched(true)}
        onChangeText={field.onChange(name)}
        testID={testID}
      />
      <ErrorMessage meta={meta} />
    </>
  );
};
