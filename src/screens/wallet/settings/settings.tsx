import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useIsAnyBackupMadeSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';

import { SettingsSelectors } from './settings.selectors';
import { SettingsStyles } from './settings.styles';

export const Settings = () => {
  const { navigate } = useNavigation();
  const colors = useColors();

  const isAnyBackupMade = useIsAnyBackupMadeSelector();

  const navigateToSettings = () => navigate(ScreensEnum.Settings);
  const navigateToDebugMode = () => navigate(ScreensEnum.Debug);

  return (
    <TouchableOpacity
      onPress={navigateToSettings}
      onLongPress={navigateToDebugMode}
      delayLongPress={4000}
      style={SettingsStyles.iconContainer}
      testID={SettingsSelectors.settingsButton}
    >
      {!isAnyBackupMade && (
        <Icon
          name={IconNameEnum.NotificationDot}
          width={formatSize(9)}
          height={formatSize(9)}
          color={colors.navigation}
          style={SettingsStyles.notificationDotIcon}
        />
      )}
      <Icon name={IconNameEnum.Settings} size={formatSize(24)} />
    </TouchableOpacity>
  );
};
