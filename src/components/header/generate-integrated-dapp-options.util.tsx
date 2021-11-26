import { StackNavigationOptions } from '@react-navigation/stack';
import React, { FC } from 'react';

import { HeaderCloseOptionsButton } from './header-close-options-button/header-close-options-button';

export const generateIntegratedAppOptions = (
  headerTitleElement: ReturnType<FC>,
  headerLeftComponent: ReturnType<FC> = null
): StackNavigationOptions => ({
  headerTitleAlign: 'center',
  headerLeft: () => headerLeftComponent,
  headerTitle: () => headerTitleElement,
  headerRight: () => <HeaderCloseOptionsButton />
});
