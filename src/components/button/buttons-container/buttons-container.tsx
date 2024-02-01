import React, { FC } from 'react';
import { View, ViewStyle } from 'react-native';

import { ButtonsContainerStyles } from './buttons-container.styles';

export const ButtonsContainer: FC<{ style?: ViewStyle }> = ({ children, style }) => (
  <View style={[ButtonsContainerStyles.container, style]}>{children}</View>
);
