import { HeaderHeightContext } from '@react-navigation/stack';
import React, { FC, useContext } from 'react';
import { ScrollView, useWindowDimensions } from 'react-native';

import { conditionalStyle } from '../../utils/conditional-style';
import { useScreenContainerStyles } from './screen-container.styles';

interface Props {
  isFullScreenMode?: boolean;
}

export const ScreenContainer: FC<Props> = ({ isFullScreenMode = false, children }) => {
  const styles = useScreenContainerStyles();
  const headerHeight = useContext(HeaderHeightContext);
  const height = useWindowDimensions().height - (headerHeight || 0);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollViewContentContainer,
        conditionalStyle(isFullScreenMode, { ...styles.fullScreenMode, height })
      ]}>
      {children}
    </ScrollView>
  );
};
