import { StackNavigationOptions } from '@react-navigation/stack';
import React, { FC } from 'react';
import { Text } from 'react-native';

import { HeaderBackButton } from './header-back-button/header-back-button';

export const exolixScreenOptions = (): StackNavigationOptions => ({
  headerTitleAlign: 'center',
  headerLeft: () => <HeaderBackButton />,
  headerTitle: () => <TitleComponent />,
  headerRight: () => null
});

const TitleComponent: FC = () => {
  return <Text>Exolix header text</Text>;
};
