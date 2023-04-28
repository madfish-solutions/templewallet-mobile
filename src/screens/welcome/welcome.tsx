import React from 'react';
import { View, Text } from 'react-native';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { Quote } from 'src/components/quote/quote';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
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

      <Divider />

      <View>
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
