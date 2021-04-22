import React from 'react';
import { Button, Text } from 'react-native';

import { ScreenContainer } from '../../components/screen-container/screen-container';
import { ScreensEnum } from '../../navigator/screens.enum';
import { useNavigation } from '../../navigator/use-navigation.hook';

export const Welcome = () => {
  const { navigate } = useNavigation();

  return (
    <ScreenContainer hasBackButton={false}>
      <Text>Welcome</Text>
      <Button title="Import Account" onPress={() => navigate(ScreensEnum.ImportAccount)} />
      <Button title="Create Account" onPress={() => navigate(ScreensEnum.CreateAccount)} />
    </ScreenContainer>
  );
};
