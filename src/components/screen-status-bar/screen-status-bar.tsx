import React, { FC } from 'react';
import { Platform, StatusBar } from 'react-native';

import { dark } from '../../config/styles';
import { isIOS } from '../../config/system';
import { useBarStyle } from '../../hooks/use-bar-style.hook';
import { useColors } from '../../styles/use-colors';

export const ScreenStatusBar: FC = () => {
  const colors = useColors();

  const { darkContent } = useBarStyle();

  return (
    <StatusBar
      barStyle={darkContent}
      backgroundColor={isIOS ? colors.navigation : Platform.Version > 22 ? colors.navigation : dark}
      animated={true}
    />
  );
};
