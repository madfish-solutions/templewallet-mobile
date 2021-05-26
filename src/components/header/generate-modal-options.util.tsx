import { StackNavigationOptions } from '@react-navigation/stack';
import React from 'react';

import { formatSize } from '../../styles/format-size';
import { HeaderCloseButton } from './header-close-button/header-close-button';
import { HeaderTitle } from './header-title/header-title';

export const generateModalOptions = (title: string): StackNavigationOptions => ({
  headerTitleAlign: 'center',
  headerStatusBarHeight: 0,
  headerStyle: { height: formatSize(60) },
  headerLeft: () => null,
  headerTitle: () => <HeaderTitle title={title} />,
  headerRight: () => <HeaderCloseButton />
});
