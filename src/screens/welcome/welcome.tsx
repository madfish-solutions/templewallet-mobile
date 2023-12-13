import React from 'react';
import { View, Text, ImageBackground } from 'react-native';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from 'src/components/divider/divider';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { LogoWithText } from 'src/components/icon/logo-with-text';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { Quote } from 'src/components/quote/quote';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { isIOS } from 'src/config/system';
import { useABTestingLoading } from 'src/hooks/use-ab-testing-loading.hook';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { ContinueWithCloudButton } from './ContinueWithCloudButton';
import { WelcomeSelectors } from './welcome.selectors';
import { useWelcomeStyles } from './welcome.styles';

export const Welcome = () => {
  const { navigate } = useNavigation();
  const styles = useWelcomeStyles();

  usePageAnalytic(ScreensEnum.Welcome);
  useABTestingLoading();

  return (
    <ScreenContainer contentContainerStyle={styles.scrollViewContentContainer} isFullScreenMode={true}>
      <ImageBackground
        resizeMode={isIOS ? 'contain' : 'cover'}
        source={require('src/components/icon/assets/background/christmas-bg.png')}
        style={styles.bg}
      >
        <InsetSubstitute />

        <View style={styles.imageView}>
          <LogoWithText width={formatSize(248)} height={formatSize(104)} style={styles.logo} />
        </View>

        <Divider size={formatSize(131)} />

        <Quote
          quote="The only function of economic forecasting is to make astrology look more respectable."
          author="John Kenneth Galbraith"
        />
      </ImageBackground>

      <Divider />

      <View style={styles.footer}>
        <ButtonLargePrimary
          title="Create a new Wallet"
          iconName={IconNameEnum.PlusSquare}
          onPress={() => navigate(ScreensEnum.CreateAccount, {})}
          testID={WelcomeSelectors.createNewWalletButton}
        />

        <View style={styles.orDivider}>
          <View style={styles.orDividerLine} />
          <Text style={styles.orDividerText}>or</Text>
          <View style={styles.orDividerLine} />
        </View>

        <ContinueWithCloudButton />

        <Divider size={formatSize(16)} />

        <View style={styles.buttonsContainer}>
          <View style={styles.buttonBox}>
            <ButtonLargeSecondary
              title="Import"
              iconName={IconNameEnum.DownloadCloud}
              onPress={() => navigate(ScreensEnum.ImportAccount)}
              testID={WelcomeSelectors.importExistingWalletButton}
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
