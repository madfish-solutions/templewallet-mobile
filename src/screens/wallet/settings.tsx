import React, { useCallback } from 'react';

import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToScreen } from 'src/navigator/hooks/use-navigation.hook';
import { useIsAnyBackupMadeSelector } from 'src/store/settings/settings-selectors';

import { ActionButton } from './action-button';
import { WalletSelectors } from './wallet.selectors';

export const Settings = () => {
  const navigateToScreen = useNavigateToScreen();

  const isAnyBackupMade = useIsAnyBackupMadeSelector();

  const navigateToSettings = useCallback(() => navigateToScreen({ screen: ScreensEnum.Settings }), [navigateToScreen]);
  const navigateToDebugMode = useCallback(() => navigateToScreen({ screen: ScreensEnum.Debug }), [navigateToScreen]);

  return (
    <ActionButton
      iconName={IconNameV2Enum.Settings}
      isDotVisible={!isAnyBackupMade}
      testID={WalletSelectors.settingsButton}
      onPress={navigateToSettings}
      onLongPress={navigateToDebugMode}
    />
  );
};
