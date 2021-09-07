import React from 'react';
import { Text } from 'react-native';
import { HeaderCard } from '../../components/header-card/header-card';
import { ScreenContainer } from '../../components/screen-container/screen-container';

export const CollectiblesHome = () => {
  return (
    <>
      <HeaderCard>
        <Text>HEADER</Text>
      </HeaderCard>
      <ScreenContainer>
        <Text>item</Text>
        <Text>item</Text>
        <Text>item</Text>
        <Text>item</Text>
        <Text>item</Text>
        <Text>item</Text>
      </ScreenContainer>
    </>
  );
};
