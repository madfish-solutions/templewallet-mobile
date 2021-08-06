import { BigNumber } from 'bignumber.js';
import { useField } from 'formik';
import React, { FC } from 'react';
import { View } from 'react-native';

import { Divider } from '../../components/divider/divider';
import { StyledNumericInput } from '../../components/styled-numberic-input/styled-numeric-input';
import { StyledNumericInputProps } from '../../components/styled-numberic-input/styled-numeric-input.props';
import { formatSize } from '../../styles/format-size';
import { TEZ_TOKEN_METADATA } from '../../token/data/tokens-metadata';
import { conditionalStyle } from '../../utils/conditional-style';
import { hasError } from '../../utils/has-error';
import { isDefined } from '../../utils/is-defined';
import { ErrorMessage } from '../error-message/error-message';
import { FormNumericInputButtons } from './form-numeric-input-buttons/form-numeric-input-buttons';
import { useFormNumericInputStyles } from './form-numeric-input.styles';

interface Props extends Pick<StyledNumericInputProps, 'decimals' | 'editable' | 'placeholder' | 'isShowCleanButton'> {
  name: string;
  maxValue?: BigNumber;
  children?: (value?: BigNumber) => JSX.Element | null;
}

export const FormNumericInput: FC<Props> = ({
  name,
  maxValue,
  decimals = TEZ_TOKEN_METADATA.decimals,
  editable,
  placeholder,
  isShowCleanButton,
  children
}) => {
  const [field, meta, helpers] = useField<BigNumber | undefined>(name);
  const isError = hasError(meta);
  const styles = useFormNumericInputStyles();

  const subtitle = children?.(field.value);

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
      <View style={conditionalStyle(isDefined(subtitle), styles.buttonsAndSubtitleWrapper)}>
        {isDefined(subtitle) && (
          <>
            {subtitle}
            <Divider size={formatSize(2)} />
          </>
        )}
        {isDefined(maxValue) && (
          <FormNumericInputButtons
            maxValue={maxValue}
            onButtonPress={newValue => helpers.setValue(newValue.decimalPlaces(decimals))}
          />
        )}
      </View>
    </>
  );
};
