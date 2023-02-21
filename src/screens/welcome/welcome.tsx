import React from 'react';
import { View, Text } from 'react-native';
import RNCloudFs from 'react-native-cloud-fs';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { Quote } from 'src/components/quote/quote';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { isAndroid } from 'src/config/system';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast } from 'src/toast/toast.utils';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { WelcomeSelectors } from './welcome.selectors';
import { useWelcomeStyles, useCloudButtonActiveColorStyleConfig } from './welcome.styles';

const CLOUD_WALLET_FOLDER = 'temple-wallet';

export const Welcome = () => {
  const { navigate } = useNavigation();
  const styles = useWelcomeStyles();
  const cloudBtnActiveColorStyleConfig = useCloudButtonActiveColorStyleConfig();

  usePageAnalytic(ScreensEnum.Welcome);

  const onContinueWithCloudButtonPress = async () => {
    let loggedInToCloud = false;
    try {
      loggedInToCloud = isAndroid ? await RNCloudFs.loginIfNeeded() : true;
      console.log('RNCloudFs.loginIfNeeded resulted:', loggedInToCloud);
    } catch (error) {
      console.error('RNCloudFs.loginIfNeeded errored:', { error });
    }

    if (!loggedInToCloud) {
      return void showErrorToast({ description: 'Failed to log-in' });
    }

    const filename = 'wallet-backup.json';
    const targetPath = `${CLOUD_WALLET_FOLDER}/${filename}`;

    const backups = await RNCloudFs.listFiles({
      scope: 'hidden',
      targetPath: CLOUD_WALLET_FOLDER
    });

    const backupFile = backups.files?.find(file => file.name === targetPath);

    if (backupFile) {
      return void navigate(ScreensEnum.ContinueWithCloud);
    }

    return void navigate(ScreensEnum.CreateAccount, { withCloud: true });
  };

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
          testID={WelcomeSelectors.CreateNewWalletButton}
        />

        <View style={styles.orDivider}>
          <View style={styles.orDividerLine} />
          <Text style={styles.orDividerText}>or</Text>
          <View style={styles.orDividerLine} />
        </View>

        <ButtonLargeSecondary
          title={`Continue with ${isAndroid ? 'Google Drive' : 'iCloud'}`}
          iconName={isAndroid ? IconNameEnum.GoogleDrive : IconNameEnum.Apple}
          activeColorStyleConfig={cloudBtnActiveColorStyleConfig[isAndroid ? 'googleDrive' : 'iCloud']}
          onPress={onContinueWithCloudButtonPress}
          testID={WelcomeSelectors.ContinueWithCloudButton}
          testIDProperties={{ cloud: isAndroid ? 'Google Drive' : 'iCloud' }}
        />

        <Divider size={formatSize(16)} />

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
