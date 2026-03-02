import BigNumber from 'bignumber.js';
import { useField } from 'formik';
import React, { FC } from 'react';

import { StyledNumericInput } from 'src/components/styled-numberic-input/styled-numeric-input';
import { StyledNumericInputProps } from 'src/components/styled-numberic-input/styled-numeric-input.props';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { hasError } from 'src/utils/has-error';
import { isDefined } from 'src/utils/is-defined';

import { ErrorMessage } from '../error-message/error-message';

import { FormNumericInputButtons } from './form-numeric-input-buttons/form-numeric-input-buttons';

interface Props
  extends Pick<StyledNumericInputProps, 'decimals' | 'editable' | 'placeholder' | 'isShowCleanButton'>,
    TestIdProps {
  name: string;
  maxValue?: BigNumber;
}

export const FormNumericInput: FC<Props> = ({
  name,
  maxValue,
  decimals,
  editable,
  placeholder,
  isShowCleanButton,
  testID
}) => {
  const [field, meta, helpers] = useField<BigNumber | undefined>(name);
  const isError = hasError(meta);

  const { metadata } = useNetworkInfo();
  const decimalsWithFallback = decimals ?? metadata.decimals;

  return (
    <>
      <StyledNumericInput
        value={field.value}
        decimals={decimalsWithFallback}
        editable={editable}
        placeholder={placeholder}
        isError={isError}
        isShowCleanButton={isShowCleanButton}
        onBlur={() => helpers.setTouched(true)}
        onChange={helpers.setValue}
        testID={testID}
      />
      <ErrorMessage meta={meta} />
      {isDefined(maxValue) && (
        <FormNumericInputButtons
          maxValue={maxValue}
          onButtonPress={newValue => helpers.setValue(newValue.decimalPlaces(decimalsWithFallback))}
        />
      )}
    </>
  );
};
