import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import React, { FC } from 'react';

import { HeaderBackButton } from './header-back-button/header-back-button';

export const generateScreenOptions = (
  headerTitleElement: ReturnType<FC>,
  headerRightElement: ReturnType<FC> = null,
  headerLeft = true
): NativeStackNavigationOptions => ({
  headerTitleAlign: 'center',
  headerLeft: () => headerLeft && <HeaderBackButton />,
  headerTitle: () => headerTitleElement,
  headerRight: () => headerRightElement
});
