import { StackNavigationOptions } from '@react-navigation/stack';
import React, { FC } from 'react';

import { EmptyFn } from 'src/config/general';

import { HeaderBackButton } from './header-back-button/header-back-button';

export const generateScreenOptions = (
  headerTitleElement: ReturnType<FC>,
  headerRightElement: ReturnType<FC> = null,
  headerLeft = true,
  backButtonFn?: EmptyFn
): StackNavigationOptions => ({
  headerTitleAlign: 'center',
  headerLeft: () => headerLeft && <HeaderBackButton onPress={backButtonFn} />,
  headerTitle: () => headerTitleElement,
  headerRight: () => headerRightElement
});
