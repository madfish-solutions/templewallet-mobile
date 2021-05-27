import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React from 'react';
import { Button, Text, View } from 'react-native';
import { getBuildNumber, getVersion } from 'react-native-device-info';
import { useDispatch } from 'react-redux';

import { Divider } from '../../components/divider/divider';
import { HeaderCard } from '../../components/header-card/header-card';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { Label } from '../../components/label/label';
import { RobotIcon } from '../../components/robot-icon/robot-icon';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { TextSegmentControl } from '../../components/segmented-control/text-segment-control/text-segment-control';
import { discordUrl, redditUrl, telegramUrl, twitterUrl, youTubeUrl } from '../../config/socials';
import { ThemesEnum } from '../../interfaces/theme.enum';
import { ScreensEnum } from '../../navigator/screens.enum';
import { useNavigation } from '../../navigator/use-navigation.hook';
import { useAppLock } from '../../shelter/use-app-lock.hook';
import { useShelter } from '../../shelter/use-shelter.hook';
import { changeTheme } from '../../store/display-settings/display-settings-actions';
import { useThemeSelector } from '../../store/display-settings/display-settings-selectors';
import { useSelectedAccountSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { generateHitSlop } from '../../styles/generate-hit-slop';
import { EraseDataButton } from './erase-data-button/erase-data-button';
import { useSettingsStyles } from './settings.styles';
import { SocialButton } from './social-button/social-button';

export const Settings = () => {
  const styles = useSettingsStyles();
  const dispatch = useDispatch();
  const { lock } = useAppLock();
  const { navigate } = useNavigation();
  const { revealSeedPhrase } = useShelter();

  const theme = useThemeSelector();
  const publicKeyHash = useSelectedAccountSelector().publicKeyHash;

  const selectedThemeIndex = theme === ThemesEnum.light ? 0 : 1;

  const handleThemeSegmentControlChange = (newThemeIndex: number) =>
    dispatch(changeTheme(newThemeIndex === 0 ? ThemesEnum.light : ThemesEnum.dark));

  return (
    <>
      <HeaderCard hasInsetTop={true}>
        <View style={styles.headerContainer}>
          <Icon name={IconNameEnum.TempleLogoWithText} width={formatSize(104)} height={formatSize(32)} />
          <Text style={styles.versionText}>{`Version: ${getVersion()}    Build: ${getBuildNumber()}`}</Text>

          <View style={styles.socialsContainer}>
            <SocialButton iconName={IconNameEnum.Telegram} url={telegramUrl} />
            <SocialButton iconName={IconNameEnum.Discord} url={discordUrl} />
            <SocialButton iconName={IconNameEnum.Twitter} url={twitterUrl} />
            <SocialButton iconName={IconNameEnum.YouTube} url={youTubeUrl} />
            <SocialButton iconName={IconNameEnum.Reddit} url={redditUrl} />
          </View>
        </View>
      </HeaderCard>
      <ScreenContainer>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionRowContainer}
            hitSlop={generateHitSlop(formatSize(8))}
            onPress={() => navigate(ScreensEnum.ManageAccounts)}>
            <View style={styles.actionRowContainer}>
              <RobotIcon seed={publicKeyHash} size={formatSize(32)} />
              <Text style={[styles.actionText, styles.actionTextMargin]}>Accounts</Text>
            </View>

            <Icon name={IconNameEnum.ChevronRight} />
          </TouchableOpacity>
        </View>

        <Divider size={formatSize(16)} />

        <View style={styles.darkAppearanceContainer}>
          <Label label="Dark Appearance" description="Manage the appearance of the app" />
          <TextSegmentControl
            selectedIndex={selectedThemeIndex}
            values={['Light', 'Dark']}
            width={formatSize(120)}
            onChange={handleThemeSegmentControlChange}
          />
        </View>
        <Divider />

        <TouchableOpacity style={styles.accountItem} onPress={() => revealSeedPhrase()}>
          <Text>Seed phrase</Text>
        </TouchableOpacity>

        <Divider />

        <Button title="Lock the App" onPress={lock} />
        <EraseDataButton />
      </ScreenContainer>
    </>
  );
};
