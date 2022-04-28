import { StackNavigationOptions } from '@react-navigation/stack';
import React, { FC } from 'react';

import { HeaderBackButton } from './header-back-button/header-back-button';

export const generateScreenOptions = (
  headerTitleElement: ReturnType<FC>,
  headerRightElement: ReturnType<FC> = null,
  headerLeft = true
): StackNavigationOptions => ({
  headerTitleAlign: 'center',
  headerLeft: () => headerLeft && <HeaderBackButton />,
  headerTitle: () => headerTitleElement,
  headerRight: () => headerRightElement
});
