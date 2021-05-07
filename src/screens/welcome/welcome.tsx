import React from 'react';
import { Text } from 'react-native';

import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../components/button/button-large/button-large-secondary/button-large-secondary';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { step } from '../../config/styles';
import { ScreensEnum } from '../../navigator/screens.enum';
import { useNavigation } from '../../navigator/use-navigation.hook';

export const Welcome = () => {
  const { navigate } = useNavigation();

  return (
    <ScreenContainer>
      <Text>Welcome</Text>
      <ButtonLargePrimary
        title="Create a new Wallet"
        iconName={IconNameEnum.PlusSquare}
        marginBottom={step}
        onPress={() => navigate(ScreensEnum.CreateAccount)}
      />
      <ButtonLargeSecondary
        title="Import existing Wallet"
        iconName={IconNameEnum.Download}
        onPress={() => navigate(ScreensEnum.ImportAccount)}
      />
    </ScreenContainer>
  );
};
