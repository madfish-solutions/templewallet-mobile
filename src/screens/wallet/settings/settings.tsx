import React from 'react';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { SafeTouchableOpacity } from 'src/components/safe-touchable-opacity';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToScreen } from 'src/navigator/hooks/use-navigation.hook';
import { useIsAnyBackupMadeSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';

import { SettingsSelectors } from './settings.selectors';
import { SettingsStyles } from './settings.styles';

export const Settings = () => {
  const navigateToScreen = useNavigateToScreen();
  const colors = useColors();

  const isAnyBackupMade = useIsAnyBackupMadeSelector();

  const navigateToSettings = () => navigateToScreen({ screen: ScreensEnum.Settings });
  const navigateToDebugMode = () => navigateToScreen({ screen: ScreensEnum.Debug });

  return (
    <SafeTouchableOpacity
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
    </SafeTouchableOpacity>
  );
};
