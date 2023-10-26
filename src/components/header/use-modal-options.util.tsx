import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import React from 'react';

import { isIOS } from '../../config/system';
//import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';
import { HeaderCloseButton } from './header-close-button/header-close-button';
import { HeaderTitle } from './header-title/header-title';

export const useModalOptions = (title: string, disableAndroidGestures = false): NativeStackNavigationOptions => {
  const colors = useColors();

  return {
    headerTitleAlign: 'center',
    headerBackVisible: false,
    //headerStatusBarHeight: 0,
    headerStyle: {
      //height: formatSize(60),
      backgroundColor: colors.navigation
      //borderBottomWidth: formatSize(0.5),
      //borderBottomColor: colors.lines,
      //shadowOpacity: 0
    },
    gestureEnabled: disableAndroidGestures ? isIOS : undefined,
    //gestureResponseDistance: isIOS ? undefined : 30,
    headerLeft: () => null,
    headerTitle: () => <HeaderTitle title={title} />,
    headerRight: () => <HeaderCloseButton />
  };
};
