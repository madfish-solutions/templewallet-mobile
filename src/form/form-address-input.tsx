import { useField } from 'formik';
import React, { FC, useCallback } from 'react';

import { AddressInput } from '../components/address-input/address-input';
import { StyledTextInputProps } from '../components/styled-text-input/styled-text-input.props';
import { emptyFn, EmptyFn } from '../config/general';
import { TestIdProps } from '../interfaces/test-id.props';
import { hasError } from '../utils/has-error';

import { ErrorMessage } from './error-message/error-message';

interface Props extends Pick<StyledTextInputProps, 'placeholder'>, TestIdProps {
  name: string;
  pasteButtonTestID?: string;
  pasteButtonTestIDProperties?: object;
  onBlur?: EmptyFn;
}

export const FormAddressInput: FC<Props> = ({
  name,
  placeholder,
  testID,
  pasteButtonTestID,
  pasteButtonTestIDProperties,
  onBlur = emptyFn
}) => {
  const [field, meta, helpers] = useField<string>(name);
  const isError = hasError(meta);

  const handleBlur = useCallback(() => {
    onBlur();
    helpers.setTouched(true);
  }, [helpers.setTouched, onBlur]);

  return (
    <>
      <AddressInput
        value={field.value}
        placeholder={placeholder}
        isError={isError}
        onBlur={handleBlur}
        onChangeText={field.onChange(name)}
        testID={testID}
        pasteButtonTestID={pasteButtonTestID}
        pasteButtonTestIDProperties={pasteButtonTestIDProperties}
      />
      <ErrorMessage meta={meta} />
    </>
  );
};
