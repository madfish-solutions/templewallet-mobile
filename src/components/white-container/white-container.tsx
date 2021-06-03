import React, { FC } from 'react';
import { View } from 'react-native';

import { useWhiteContainerStyles } from './white-container.styles';

export const WhiteContainer: FC = ({ children }) => {
  const styles = useWhiteContainerStyles();

  return <View style={styles.container}>{children}</View>;
};
