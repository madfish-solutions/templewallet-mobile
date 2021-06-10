import { BigNumber } from 'bignumber.js';
import { useField } from 'formik';
import React, { FC } from 'react';

import { StyledNumericInput } from '../components/styled-numberic-input/styled-numeric-input';
import { StyledNumericInputProps } from '../components/styled-numberic-input/styled-numeric-input.props';
import { emptyFn } from '../config/general';
import { hasError } from '../utils/has-error';
import { ErrorMessage } from './error-message/error-message';

interface Props
  extends Pick<StyledNumericInputProps, 'decimals' | 'min' | 'max' | 'editable' | 'isShowCleanButton' | 'onChange'> {
  name: string;
}

export const FormNumericInput: FC<Props> = ({
  name,
  decimals,
  isShowCleanButton,
  min,
  max,
  onChange = emptyFn,
  editable
}) => {
  const [field, meta, helpers] = useField<BigNumber | undefined>(name);
  const isError = hasError(meta);

  const handleChange = (newValue?: BigNumber) => {
    helpers.setValue(newValue);
    onChange(newValue);
  };

  return (
    <>
      <StyledNumericInput
        value={field.value}
        decimals={decimals}
        min={min}
        max={max}
        editable={editable}
        isError={isError}
        isShowCleanButton={isShowCleanButton}
        onBlur={field.onBlur(name)}
        onChange={handleChange}
      />
      <ErrorMessage meta={meta} />
    </>
  );
};
