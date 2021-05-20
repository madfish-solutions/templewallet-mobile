import React, { FC } from 'react';
import { PanResponder, ScrollView, useWindowDimensions } from 'react-native';

import { conditionalStyle } from '../../utils/conditional-style';
import { useScreenContainerStyles } from './screen-container.styles';
import { PanGestureHandler } from 'react-native-gesture-handler';

interface Props {
  isFullScreenMode?: boolean;
}

export const ScreenContainer: FC<Props> = ({ isFullScreenMode = false, children }) => {
  const height = useWindowDimensions().height;
  const styles = useScreenContainerStyles();

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.scrollViewContentContainer,
        conditionalStyle(isFullScreenMode, { ...styles.fullScreenMode, height })
      ]}>
      {children}
    </ScrollView>
  );
};
