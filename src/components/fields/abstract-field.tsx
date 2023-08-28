import React, { FC, ReactNode } from 'react';
import { View, Text } from 'react-native';

import { FormCheckbox } from 'src/form/form-checkbox';
import { formatSize } from 'src/styles/format-size';

import { CheckboxLabel } from '../checkbox-description/checkbox-label';
import { Divider } from '../divider/divider';
import { useAbstractFieldStyles } from './abstract-field.styles';
import { FieldProps } from './field.props';

interface Props extends FieldProps {
  title: string;
  description: ReactNode;
}
export const AbstractField: FC<Props> = ({ name, title, description, testID }) => {
  const styles = useAbstractFieldStyles();

  return (
    <>
      <View style={[styles.checkboxContainer, styles.removeMargin]}>
        <FormCheckbox name={name} testID={testID}>
          <Divider size={formatSize(8)} />
          <Text style={styles.checkboxText}>{title}</Text>
        </FormCheckbox>
      </View>
      <CheckboxLabel>{description}</CheckboxLabel>
    </>
  );
};
