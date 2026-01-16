import React, { FC } from 'react';
import { StatusBar } from 'react-native';

import { useBarStyle } from 'src/hooks/use-bar-style.hook';
import { useColors } from 'src/styles/use-colors';

export const ScreenStatusBar: FC = () => {
  const colors = useColors();

  const { darkContent } = useBarStyle();

  return <StatusBar barStyle={darkContent} backgroundColor={colors.navigation} animated={true} />;
};
