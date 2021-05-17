import React from 'react';
import { Image, Text } from 'react-native';

import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../components/button/button-large/button-large-secondary/button-large-secondary';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { step } from '../../config/styles';
import { ScreensEnum } from '../../navigator/screens.enum';
import { useNavigation } from '../../navigator/use-navigation.hook';
import { useWelcomeStyles } from './welcome.styles';

export const Welcome = () => {
  const { navigate } = useNavigation();
  const styles = useWelcomeStyles();

  return (
    <ScreenContainer>
      <Text style={styles.headerTitle}>
        <Text style={styles.headerTitleQuotes}>“</Text>The only function of economic forecasting is to make astrology
        look more respectable.
        <Text style={styles.headerTitleQuotes}>”</Text>
      </Text>
      <Text style={styles.headerSecondTitle}>John Kenneth Galbraith</Text>
      <Image source={require('../../assets/temple-logo-with-text.png')} />
      <ButtonLargePrimary
        title="Create a new Wallet"
        iconName={IconNameEnum.PlusSquare}
        marginBottom={step}
        onPress={() => navigate(ScreensEnum.CreateAccount)}
      />
      <Text style={styles.afterButtonsTitle}>
        New to Temple Wallet? Let's set it up! This will create a new wallet and seed phrase
      </Text>
      <ButtonLargeSecondary
        title="Import existing Wallet"
        iconName={IconNameEnum.Download}
        onPress={() => navigate(ScreensEnum.ImportAccount)}
      />
      <Text style={styles.afterButtonsTitle}>
        Already have a seed phrase? Import your existing wallet using a 12 or more mnemonic words
      </Text>
    </ScreenContainer>
  );
};
