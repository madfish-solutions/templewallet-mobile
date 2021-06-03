import React from 'react';
import { Text, View } from 'react-native';
import { getBuildNumber, getVersion } from 'react-native-device-info';

import { HeaderCard } from '../../../components/header-card/header-card';
import { Icon } from '../../../components/icon/icon';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { discordUrl, redditUrl, telegramUrl, twitterUrl, youTubeUrl } from '../../../config/socials';
import { formatSize } from '../../../styles/format-size';
import { useSettingsHeaderStyles } from './settings-header.styles';
import { SocialButton } from './social-button/social-button';

export const SettingsHeader = () => {
  const styles = useSettingsHeaderStyles();

  return (
    <HeaderCard hasInsetTop={true}>
      <View style={styles.headerContainer}>
        <Icon name={IconNameEnum.TempleLogoWithText} width={formatSize(104)} height={formatSize(32)} />
        <Text style={styles.versionText}>{`VERSION: ${getVersion()}    BUILD: ${getBuildNumber()}`}</Text>

        <View style={styles.socialsContainer}>
          <SocialButton iconName={IconNameEnum.Telegram} url={telegramUrl} />
          <SocialButton iconName={IconNameEnum.Discord} url={discordUrl} />
          <SocialButton iconName={IconNameEnum.Twitter} url={twitterUrl} />
          <SocialButton iconName={IconNameEnum.YouTube} url={youTubeUrl} />
          <SocialButton iconName={IconNameEnum.Reddit} url={redditUrl} />
        </View>
      </View>
    </HeaderCard>
  );
};
