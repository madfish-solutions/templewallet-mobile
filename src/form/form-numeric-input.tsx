import { BigNumber } from 'bignumber.js';
import { useField } from 'formik';
import React, { FC } from 'react';

import { StyledNumericInput } from '../components/styled-numberic-input/styled-numeric-input';
import { emptyFn, EventFn } from '../config/general';
import { hasError } from '../utils/has-error';
import { ErrorMessage } from './error-message/error-message';

interface Props {
  name: string;
  decimals?: number;
  isShowCleanButton?: boolean;
  min?: BigNumber;
  max?: BigNumber;
  onChange?: EventFn<BigNumber | undefined>;
  editable?: boolean;
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
        decimals={decimals}
        editable={editable}
        isShowCleanButton={isShowCleanButton}
        min={min}
        max={max}
        value={field.value}
        isError={isError}
        onBlur={field.onBlur(name)}
        onChange={handleChange}
      />
      <ErrorMessage meta={meta} />
    </>
  );
};
