import React, { FC } from 'react';
import { ScrollView, useWindowDimensions } from 'react-native';

import { conditionalStyle } from '../../utils/conditional-style';
import { ScreenContainerStyles } from './screen-container.styles';

interface Props {
  isFullScreenMode?: boolean;
}

export const ScreenContainer: FC<Props> = ({ isFullScreenMode = false, children }) => {
  const height = useWindowDimensions().height;

  return (
    <ScrollView
      contentContainerStyle={[
        ScreenContainerStyles.scrollViewContentContainer,
        conditionalStyle(isFullScreenMode, { ...ScreenContainerStyles.fullScreenMode, height })
      ]}>
      {children}
    </ScrollView>
  );
};
