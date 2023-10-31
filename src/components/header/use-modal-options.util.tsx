import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import React from 'react';

import { isIOS } from 'src/config/system';
import { useColors } from 'src/styles/use-colors';

import { HeaderCloseButton } from './header-close-button/header-close-button';
import { HeaderTitle } from './header-title/header-title';

export const useModalOptions = (title: string, disableAndroidGestures = false): NativeStackNavigationOptions => {
  const colors = useColors();

  return {
    headerTitleAlign: 'center',
    headerBackVisible: false,
    headerStyle: {
      backgroundColor: colors.navigation
    },
    gestureEnabled: disableAndroidGestures ? isIOS : undefined,
    headerLeft: () => null,
    headerTitle: () => <HeaderTitle title={title} />,
    headerRight: () => <HeaderCloseButton />
  };
};
