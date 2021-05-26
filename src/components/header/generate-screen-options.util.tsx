import { StackNavigationOptions } from '@react-navigation/stack';
import React, { FC } from 'react';

import { HeaderBackButton } from './header-back-button/header-back-button';

export const generateScreenOptions = (
  headerTitleElement: ReturnType<FC>,
  headerRightElement: ReturnType<FC> = null
): StackNavigationOptions => ({
  headerTitleAlign: 'center',
  headerLeft: () => <HeaderBackButton />,
  headerTitle: () => headerTitleElement,
  headerRight: () => headerRightElement
});
