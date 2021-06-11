import React, { Children, FC } from 'react';
import { Text, View } from 'react-native';

import { isDefined } from '../../utils/is-defined';
import { useCheckboxDescriptionStyles } from './checkbox-description.styles';

export const CheckboxLabel: FC = ({ children }) => {
  const styles = useCheckboxDescriptionStyles();

  return (
    <View style={styles.labelContainer}>
      {Children.map(
        children,
        (child, index) =>
          isDefined(child) && (
            <Text style={styles.labelText} key={index}>
              {child}
            </Text>
          )
      )}
    </View>
  );
};
