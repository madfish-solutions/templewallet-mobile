import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { ButtonsContainerStyles } from './buttons-container.styles';

export const ButtonsContainer: FCWithChildren<{ style?: StyleProp<ViewStyle> }> = ({ children, style }) => (
  <View style={[ButtonsContainerStyles.container, style]}>{children}</View>
);
