import React from 'react';
import { Image, Text, View } from 'react-native';

import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../components/button/button-large/button-large-secondary/button-large-secondary';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { Label } from '../../components/label/label';
import { ScreensEnum } from '../../navigator/screens.enum';
import { useNavigation } from '../../navigator/use-navigation.hook';
import { formatSize } from '../../styles/format-size';
import { useWelcomeStyles } from './welcome.styles';

export const Welcome = () => {
  const { navigate } = useNavigation();
  const styles = useWelcomeStyles();

  return (
    <View style={styles.view}>
      <View>
        <InsetSubstitute />
        <Text style={styles.headerTitle}>
          <Text style={styles.headerTitleQuotes}>“</Text>The only function of economic forecasting is to make astrology
          look more respectable.
          <Text style={styles.headerTitleQuotes}>”</Text>
        </Text>
        <Text style={styles.headerSecondTitle}>John Kenneth Galbraith</Text>
      </View>
      <View style={styles.imageView}>
        <Image style={styles.image} source={require('../../assets/temple-logo-with-text.png')} />
      </View>
      <View>
        <ButtonLargePrimary
          title="Create a new Wallet"
          iconName={IconNameEnum.PlusSquare}
          marginBottom={formatSize(8)}
          onPress={() => navigate(ScreensEnum.CreateAccount)}
        />
        <Label description="New to Temple Wallet? Let's set it up! This will create a new wallet and seed phrase" />
        <ButtonLargeSecondary
          title="Import existing Wallet"
          iconName={IconNameEnum.Download}
          marginTop={formatSize(24)}
          marginBottom={formatSize(8)}
          onPress={() => navigate(ScreensEnum.ImportAccount)}
        />
        <Label description="Already have a seed phrase? Import your existing wallet using a 12 or more mnemonic words" />
        <InsetSubstitute type="bottom" />
      </View>
    </View>
  );
};
