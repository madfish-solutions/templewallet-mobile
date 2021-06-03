import React from 'react';
import { View } from 'react-native';

import { useWhiteContainerDividerStyles } from './white-container-divider.styles';

export const WhiteContainerDivider = () => {
  const styles = useWhiteContainerDividerStyles();

  return <View style={styles.divider} />;
};
