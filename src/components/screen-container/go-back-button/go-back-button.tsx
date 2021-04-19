import React from 'react';
import { Button } from 'react-native';

import { useNavigation } from '../../../navigator/use-navigation.hook';

export const GoBackButton = () => {
  const { goBack } = useNavigation();

  return <Button title="Back" onPress={goBack} />;
};
