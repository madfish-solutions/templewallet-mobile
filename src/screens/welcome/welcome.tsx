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
import { isAndroid } from 'src/config/system';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast } from 'src/toast/toast.utils';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import {
  cloudTitle,
  fetchCloudBackupFileDetails,
  isCloudAvailable,
  requestSignInToCloud,
  syncCloud
} from 'src/utils/cloud-backup';

import { WelcomeSelectors } from './welcome.selectors';
import { useWelcomeStyles, useCloudButtonActiveColorStyleConfig } from './welcome.styles';

export const Welcome = () => {
  const { navigate } = useNavigation();
  const styles = useWelcomeStyles();
  const cloudBtnActiveColorStyleConfig = useCloudButtonActiveColorStyleConfig();

  usePageAnalytic(ScreensEnum.Welcome);

  const onContinueWithCloudButtonPress = async () => {
    try {
      const loggedInToCloud = await requestSignInToCloud();

      if (!loggedInToCloud) {
        return;
      }
    } catch (error) {
      return void showErrorToast({
        title: 'Failed to log-in',
        description: (error as Error)?.message ?? 'Unknown reason'
      });
    }

    try {
      await syncCloud();
    } catch (error) {
      return void showErrorToast({
        title: 'Failed to sync cloud',
        description: (error as Error)?.message ?? 'Unknown reason'
      });
    }

    const backupFile = await fetchCloudBackupFileDetails();

    if (backupFile) {
      return void navigate(ScreensEnum.RestoreFromCloud, { fileId: backupFile.id });
    }

    return void navigate(ScreensEnum.CreateAccount, { backupToCloud: true });
  };

  const cloudIsAvailable = isCloudAvailable();

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

        {cloudIsAvailable ? (
          <>
            <ButtonLargeSecondary
              title={`Continue with ${cloudTitle}`}
              iconName={isAndroid ? IconNameEnum.GoogleDrive : IconNameEnum.Apple}
              activeColorStyleConfig={cloudBtnActiveColorStyleConfig[isAndroid ? 'googleDrive' : 'iCloud']}
              onPress={onContinueWithCloudButtonPress}
              testID={WelcomeSelectors.continueWithCloudButton}
              testIDProperties={{ cloud: cloudTitle }}
            />

            <Divider size={formatSize(16)} />
          </>
        ) : null}

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
