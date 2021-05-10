import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs/src/types';
import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';

export const DisabledTabBarButton = ({ children, style, ...props }: BottomTabBarButtonProps) => (
  <TouchableWithoutFeedback {...props} disabled={true}>
    <View style={style}>{children}</View>
  </TouchableWithoutFeedback>
);
