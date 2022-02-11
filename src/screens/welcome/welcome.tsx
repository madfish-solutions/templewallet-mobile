import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from '../../components/divider/divider';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { Quote } from '../../components/quote/quote';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { formatSize } from '../../styles/format-size';
import { WelcomeSelectors } from './welcome.selectors';
import { useWelcomeStyles } from './welcome.styles';
import { generateSK64 } from '../../utils/crypto.util';

export const Welcome = () => {
  const { navigate } = useNavigation();
  const styles = useWelcomeStyles();
  const [masterKey, setMasterKey] = useState('')

  useEffect(() => {
    generateSK64().then((key) => { setMasterKey(key) })
  }, [])

  return (
    <ScreenContainer isFullScreenMode={true}>
      <View style={styles.imageView}>
        <InsetSubstitute />
        <Icon name={IconNameEnum.TempleLogoWithText} width={formatSize(208)} height={formatSize(64)} />
      </View>
      <Divider />
      <Quote
        quote="The only function of economic forecasting is to make astrology look more respectable."
        author="John Kenneth Galbraith"
      />
      <View><Text>{masterKey}</Text></View>
      <Divider />
      <View>
        <ButtonLargePrimary
          title="Create a new Wallet"
          iconName={IconNameEnum.PlusSquare}
          onPress={() => navigate(ScreensEnum.CreateAccount)}
          testID={WelcomeSelectors.CreateNewWalletButton}
        />
        <Divider size={formatSize(24)} />

        <View style={styles.buttonsContainer}>
          <View style={styles.buttonBox}>
            <ButtonLargeSecondary
              title="Import"
              iconName={IconNameEnum.DownloadCloud}
              onPress={() => navigate(ScreensEnum.ImportAccount)}
              testID={WelcomeSelectors.ImportExistingWalletButton}
            />
          </View>
          <View style={styles.buttonBox}>
            <ButtonLargeSecondary
              title="Sync"
              iconName={IconNameEnum.Link}
              onPress={() => navigate(ScreensEnum.SyncInstructions)}
            />
          </View>
        </View>
        <InsetSubstitute type="bottom" />
      </View>
    </ScreenContainer>
  );
};
