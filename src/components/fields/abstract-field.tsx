import React, { memo } from 'react';
import { View, Text } from 'react-native';

import { FormCheckbox } from 'src/form/form-checkbox';
import { formatSize } from 'src/styles/format-size';

import { Divider } from '../divider/divider';

import { useAbstractFieldStyles } from './abstract-field.styles';
import { FieldProps } from './field.props';

interface Props extends FieldProps {
  title: string;
}

export const AbstractField = memo<Props>(({ name, title, testID }) => {
  const styles = useAbstractFieldStyles();

  return (
    <>
      <View style={styles.checkboxContainer}>
        <FormCheckbox name={name} testID={testID} inverted shouldShowError={false}>
          <Divider size={formatSize(4)} />
          <Text style={styles.checkboxText}>{title}</Text>
        </FormCheckbox>
      </View>
    </>
  );
});
