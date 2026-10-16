import React from 'react';
import { Text, View } from 'react-native';
import { getBuildNumber, getVersion } from 'react-native-device-info';

import { HeaderCard } from 'src/components/header-card/header-card';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { SocialButton } from 'src/components/social-button';
import { SocialIconNameEnum } from 'src/components/social-button/social-icon-name-enum';
import { discordUrl, redditUrl, telegramUrl, twitterUrl, youTubeUrl } from 'src/config/socials';
import { formatSize } from 'src/styles/format-size';

import { SettingsHeaderSelectors } from './selectors';
import { useSettingsHeaderStyles } from './settings-header.styles';

export const SettingsHeader = () => {
  const styles = useSettingsHeaderStyles();

  return (
    <HeaderCard hasInsetTop hasShadow>
      <View style={styles.headerContainer}>
        <Icon name={IconNameEnum.TempleLogoWithText} width={formatSize(104)} height={formatSize(32)} />
        <Text style={styles.versionText}>{`VERSION: ${getVersion()}    BUILD: ${getBuildNumber()}`}</Text>

        <View style={styles.socialsContainer}>
          <SocialButton
            iconName={SocialIconNameEnum.Telegram}
            url={telegramUrl}
            testID={SettingsHeaderSelectors.telegramButton}
          />
          <SocialButton
            iconName={SocialIconNameEnum.Discord}
            url={discordUrl}
            testID={SettingsHeaderSelectors.discordButton}
          />
          <SocialButton
            iconName={SocialIconNameEnum.Twitter}
            url={twitterUrl}
            testID={SettingsHeaderSelectors.twitterButton}
          />
          <SocialButton
            iconName={SocialIconNameEnum.YouTube}
            url={youTubeUrl}
            testID={SettingsHeaderSelectors.youtubeButton}
          />
          <SocialButton
            iconName={SocialIconNameEnum.Reddit}
            url={redditUrl}
            testID={SettingsHeaderSelectors.redditButton}
          />
        </View>
      </View>
    </HeaderCard>
  );
};
