import React from 'react';
import { Text } from 'react-native';

import { useCheckboxDescriptionStyles } from './checkbox-description.styles';

export const CheckboxLabel: FCWithChildren = ({ children }) => {
  const styles = useCheckboxDescriptionStyles();

  return <Text style={styles.label}>{children}</Text>;
};
