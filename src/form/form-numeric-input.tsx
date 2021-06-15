import { BigNumber } from 'bignumber.js';
import { useField } from 'formik';
import React, { FC } from 'react';

import { StyledNumericInput } from '../components/styled-numberic-input/styled-numeric-input';
import { StyledNumericInputProps } from '../components/styled-numberic-input/styled-numeric-input.props';
import { hasError } from '../utils/has-error';
import { ErrorMessage } from './error-message/error-message';

interface Props extends Pick<StyledNumericInputProps, 'decimals' | 'editable' | 'isShowCleanButton'> {
  name: string;
}

export const FormNumericInput: FC<Props> = ({ name, decimals, editable, isShowCleanButton }) => {
  const [field, meta, helpers] = useField<BigNumber | undefined>(name);
  const isError = hasError(meta);

  return (
    <>
      <StyledNumericInput
        value={field.value}
        decimals={decimals}
        editable={editable}
        isError={isError}
        isShowCleanButton={isShowCleanButton}
        onBlur={() => helpers.setTouched(true)}
        onChange={helpers.setValue}
      />
      <ErrorMessage meta={meta} />
    </>
  );
};
