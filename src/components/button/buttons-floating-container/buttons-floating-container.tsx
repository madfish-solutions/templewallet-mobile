import React, { FC } from 'react';
import { View } from 'react-native';

import { useButtonsFloatingContainerStyles } from './buttons-floating-container.styles';

export const ButtonsFloatingContainer: FC = ({ children }) => {
  const styles = useButtonsFloatingContainerStyles();

  return <View style={styles.container}>{children}</View>;
};
