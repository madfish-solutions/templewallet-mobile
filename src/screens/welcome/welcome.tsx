import React from 'react';
import { Button, Text } from 'react-native';

import { ScreensEnum } from '../../navigator/screens.enum';
import { useNavigation } from '../../navigator/use-navigation.hook';

export const Welcome = () => {
  const { navigate } = useNavigation();

  return (
    <>
      <Text>Welcome</Text>
      <Button title="Import Account" onPress={() => navigate(ScreensEnum.ImportAccount)} />
      <Button title="Create Account" onPress={() => navigate(ScreensEnum.CreateAccount)} />
    </>
  );
};
