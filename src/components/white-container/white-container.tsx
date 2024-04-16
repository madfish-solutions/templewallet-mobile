import React, { memo, PropsWithChildren } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { useWhiteContainerStyles } from './white-container.styles';

interface Props {
  style?: StyleProp<ViewStyle>;
}

export const WhiteContainer = memo<PropsWithChildren<Props>>(({ children, style }) => {
  const styles = useWhiteContainerStyles();

  return <View style={[styles.container, style]}>{children}</View>;
});
