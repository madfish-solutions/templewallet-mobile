import { BigNumber } from 'bignumber.js';
import { useField } from 'formik';
import React, { FC } from 'react';

import { StyledNumericInput } from '../components/styled-numberic-input/styled-numeric-input';
import { hasError } from '../utils/has-error';
import { ErrorMessage } from './error-message/error-message';

interface Props {
  name: string;
  decimals?: number;
  isShowCleanButton?: boolean;
  min?: BigNumber | number;
  max?: BigNumber | number;
  readOnly?: boolean;
}

export const FormNumericInput: FC<Props> = ({ name, decimals, isShowCleanButton, min, max, readOnly }) => {
  const [field, meta, helpers] = useField<BigNumber | undefined>(name);
  const isError = hasError(meta);

  return (
    <>
      <StyledNumericInput
        decimals={decimals}
        isShowCleanButton={isShowCleanButton}
        min={min}
        max={max}
        value={field.value}
        isError={isError}
        onBlur={field.onBlur(name)}
        onChange={helpers.setValue}
        readOnly={readOnly}
      />
      <ErrorMessage meta={meta} />
    </>
  );
};
