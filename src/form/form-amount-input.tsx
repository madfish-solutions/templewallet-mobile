import { BigNumber } from 'bignumber.js';
import { useField } from 'formik';
import React, { FC } from 'react';

import { StyledNumericInput } from '../components/styled-numberic-input/styled-numeric-input';
import { StyledNumericInputProps } from '../components/styled-numberic-input/styled-numeric-input.props';
import { hasError } from '../utils/has-error';
import { ErrorMessage } from './error-message/error-message';

interface Props extends Pick<StyledNumericInputProps, 'decimals' | 'editable' | 'placeholder' | 'isShowCleanButton'> {
  name: string;
}

export const FormAmountInput: FC<Props> = ({ name, decimals, editable, placeholder, isShowCleanButton }) => {
  const [field, meta, helpers] = useField<BigNumber | undefined>(name);
  const isError = hasError(meta);

  return (
    <>
      <StyledNumericInput
        value={field.value}
        decimals={decimals}
        editable={editable}
        placeholder={placeholder}
        isError={isError}
        isShowCleanButton={isShowCleanButton}
        onBlur={() => helpers.setTouched(true)}
        onChange={helpers.setValue}
      />
      <ErrorMessage meta={meta} />
    </>
  );
};
