import React from 'react';
import { View, Text } from 'react-native';

import { ButtonDelegatePrimary } from 'src/components/button/button-large/button-delegate-primary/button-delegate-primary';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { Quote } from 'src/components/quote/quote';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { useABTestingLoading } from 'src/hooks/use-ab-testing-loading.hook';
import { useNoInternetWarningToast } from 'src/hooks/use-no-internet-warning-toast';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
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

  const handleNoInternet = useNoInternetWarningToast();

  usePageAnalytic(ScreensEnum.Welcome);
  useABTestingLoading();

  return (
    <ScreenContainer isFullScreenMode={true}>
      <View style={styles.imageView}>
        <InsetSubstitute />
        <Icon name={IconNameEnum.TempleLogoWithText} width={formatSize(208)} height={formatSize(64)} />

        <Divider size={formatSize(60)} />

        <Quote
          quote="The only function of economic forecasting is to make astrology look more respectable."
          author="John Kenneth Galbraith"
        />
      </View>

      <View>
        <ContinueWithCloudButton />

        <View style={styles.orDivider}>
          <View style={styles.orDividerLine} />
          <Text style={styles.orDividerText}>or</Text>
          <View style={styles.orDividerLine} />
        </View>

        <ButtonLargePrimary
          title="Create New Wallet"
          iconName={IconNameEnum.PlusSquare}
          onPress={handleNoInternet(() => navigate(ScreensEnum.CreateAccount, {}))}
          testID={WelcomeSelectors.createNewWalletButton}
        />

        <Divider size={formatSize(16)} />

        <ButtonDelegatePrimary
          title="Import Existing Wallet"
          iconName={IconNameEnum.ImportSquare}
          onPress={handleNoInternet(() => navigate(ModalsEnum.ChooseWalletImportType))}
          testID={WelcomeSelectors.importExistingWalletButton}
        />

        <InsetSubstitute type="bottom" />
      </View>
    </ScreenContainer>
  );
};
