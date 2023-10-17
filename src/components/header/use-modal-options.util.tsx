import { StackNavigationOptions } from '@react-navigation/stack';
import React, { useMemo } from 'react';

import { isIOS } from 'src/config/system';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { isDefined } from 'src/utils/is-defined';

import { HeaderCloseButton } from './header-close-button/header-close-button';
import { HeaderTitle } from './header-title/header-title';

export const useModalOptions = (title?: string, disableAndroidGestures = false): StackNavigationOptions => {
  const colors = useColors();

  return useMemo(
    () => ({
      headerTitleAlign: 'center',
      headerStatusBarHeight: 0,
      headerStyle: {
        height: formatSize(60),
        backgroundColor: colors.navigation,
        borderBottomWidth: formatSize(0.5),
        borderBottomColor: colors.lines,
        shadowOpacity: 0
      },
      gestureEnabled: disableAndroidGestures ? isIOS : undefined,
      gestureResponseDistance: isIOS ? undefined : 30,
      headerLeft: () => null,
      headerTitle: () => (isDefined(title) ? <HeaderTitle title={title} /> : null),
      headerRight: () => <HeaderCloseButton />
    }),
    [title, disableAndroidGestures, colors.lines, colors.navigation]
  );
};
