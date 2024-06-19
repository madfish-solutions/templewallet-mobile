import React, { FC } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { useButtonsFloatingContainerStyles } from './buttons-floating-container.styles';

interface ButtonsFloatingContainerProps {
  style?: StyleProp<ViewStyle>;
}

export const ButtonsFloatingContainer: FC<ButtonsFloatingContainerProps> = ({ children, style }) => {
  const styles = useButtonsFloatingContainerStyles();

  return <View style={[styles.container, style]}>{children}</View>;
};
