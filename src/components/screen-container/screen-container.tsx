import React, { FC } from 'react';
import { ScrollView, StyleProp, ViewStyle } from 'react-native';

import { conditionalStyle } from '../../utils/conditional-style';
import { useScreenContainerStyles } from './screen-container.styles';

interface Props {
  isFullScreenMode?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ScreenContainer: FC<Props> = ({ isFullScreenMode = false, style, children }) => {
  const styles = useScreenContainerStyles();

  return (
    <ScrollView
      style={[styles.scrollView, style]}
      contentContainerStyle={[
        styles.scrollViewContentContainer,
        conditionalStyle(isFullScreenMode, styles.fullScreenMode)
      ]}>
      {children}
    </ScrollView>
  );
};
