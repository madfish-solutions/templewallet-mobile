import React from 'react';
import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenContainer } from '../../components/screen-container/screen-container';

export const Swap = () => {
  const { top } = useSafeAreaInsets();

  return (
    <ScreenContainer>
      <Text>test</Text>
    </ScreenContainer>
  );
};
