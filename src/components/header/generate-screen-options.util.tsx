import { StackNavigationOptions } from '@react-navigation/stack';
import React from 'react';

import { isDefined } from 'src/utils/is-defined';

import { HeaderBackButton } from './header-back-button/header-back-button';

export const generateScreenOptions = (
  headerTitleElement: ReturnType<SyncFC>,
  headerRightElement: ReturnType<SyncFC> = null,
  headerLeft = true,
  customHeaderStyle?: StackNavigationOptions['headerStyle']
): StackNavigationOptions => ({
  headerTitleAlign: 'center',
  headerLeft: () => headerLeft && <HeaderBackButton />,
  headerTitle: () => headerTitleElement,
  headerRight: () => headerRightElement,
  ...(isDefined(customHeaderStyle) && { headerStyle: customHeaderStyle })
});
