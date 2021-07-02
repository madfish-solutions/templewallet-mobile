import { BigNumber } from 'bignumber.js';
import { useField } from 'formik';
import React, { FC } from 'react';

import { StyledNumericInput } from '../../components/styled-numberic-input/styled-numeric-input';
import { StyledNumericInputProps } from '../../components/styled-numberic-input/styled-numeric-input.props';
import { TEZ_TOKEN_METADATA } from '../../token/data/tokens-metadata';
import { hasError } from '../../utils/has-error';
import { isDefined } from '../../utils/is-defined';
import { ErrorMessage } from '../error-message/error-message';
import { FormNumericInputButtons } from './form-numeric-input-buttons/form-numeric-input-buttons';

interface Props extends Pick<StyledNumericInputProps, 'decimals' | 'editable' | 'placeholder' | 'isShowCleanButton'> {
  name: string;
  maxValue?: BigNumber;
}

export const FormNumericInput: FC<Props> = ({
  name,
  maxValue,
  decimals = TEZ_TOKEN_METADATA.decimals,
  editable,
  placeholder,
  isShowCleanButton
}) => {
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
      {isDefined(maxValue) && (
        <FormNumericInputButtons
          maxValue={maxValue}
          onButtonPress={newValue => helpers.setValue(newValue.decimalPlaces(decimals))}
        />
      )}
    </>
  );
};
