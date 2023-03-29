import React from 'react';
import { TouchableOpacity } from 'react-native';

import { Icon } from '../../../components/icon/icon';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { ScreensEnum } from '../../../navigator/enums/screens.enum';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { useIsManualBackupMadeSelector } from '../../../store/settings/settings-selectors';
import { formatSize } from '../../../styles/format-size';
import { useColors } from '../../../styles/use-colors';
import { SettingsSelectors } from './settings.selectors';
import { SettingsStyles } from './settings.styles';

export const Settings = () => {
  const { navigate } = useNavigation();
  const colors = useColors();

  const isManualBackupMade = useIsManualBackupMadeSelector();

  const navigateToSettings = () => navigate(ScreensEnum.Settings);
  const navigateToDebugMode = () => navigate(ScreensEnum.Debug);

  return (
    <TouchableOpacity
      onPress={navigateToSettings}
      onLongPress={navigateToDebugMode}
      style={SettingsStyles.iconContainer}
      testID={SettingsSelectors.settingsButton}
    >
      {!isManualBackupMade && (
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
