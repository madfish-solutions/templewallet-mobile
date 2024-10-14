import { StackNavigationOptions } from '@react-navigation/stack';
import React, { FC } from 'react';

import { transparent } from 'src/config/styles';

import { HeaderBackButton } from './header-back-button/header-back-button';

export const generateScreenOptions = (
  headerTitleElement: ReturnType<FC>,
  headerRightElement: ReturnType<FC> = null,
  headerLeft = true,
  styledHeader = true
): StackNavigationOptions => ({
  headerTitleAlign: 'center',
  headerLeft: () => headerLeft && <HeaderBackButton />,
  headerTitle: () => headerTitleElement,
  headerRight: () => headerRightElement,
  ...(!styledHeader && { headerStyle: { borderBottomWidth: 0, shadowColor: transparent } })
});
