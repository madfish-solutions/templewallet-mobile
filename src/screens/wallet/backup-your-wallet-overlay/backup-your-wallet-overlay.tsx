import { Portal } from '@gorhom/portal';
import React, { useContext } from 'react';
import { View, Text } from 'react-native';

import { BottomSheetActionButton } from 'src/components/bottom-sheet/bottom-sheet-action-button/bottom-sheet-action-button';
import { useDropdownBottomSheetStyles } from 'src/components/bottom-sheet/bottom-sheet.styles';
import { isAndroid } from 'src/config/system';
import { CurrentRouteNameContext } from 'src/navigator/current-route-name.context';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useIsBackupMadeSelector } from 'src/store/settings/settings-selectors';

import { useBackupYourWalletOverlayStyles } from './backup-your-wallet-overlay.styles';

export const BackupYourWalletOverlay = () => {
  const { navigate } = useNavigation();

  const styles = useBackupYourWalletOverlayStyles();
  const dropdownBottomSheetStyles = useDropdownBottomSheetStyles();

  const { isManualBackupMade, isCloudBackupMade } = useIsBackupMadeSelector();
  const currentRouteName = useContext(CurrentRouteNameContext);

  const isShowOverlay = currentRouteName === ScreensEnum.Wallet && !isManualBackupMade && !isCloudBackupMade;

  if (!isShowOverlay) {
    return null;
  }

  return (
    <Portal>
      <View style={styles.backdrop}>
        <View style={[dropdownBottomSheetStyles.root, styles.root]}>
          <View style={dropdownBottomSheetStyles.headerContainer}>
            <Text style={dropdownBottomSheetStyles.title}>Backup your wallet</Text>
            <Text style={dropdownBottomSheetStyles.description}>
              {'Don’t lose your wallet! Save your access \nto accounts.'}
            </Text>
          </View>

          <BottomSheetActionButton title={`Backup to ${isAndroid ? 'Google Drive' : 'iCloud'}`} />

          <BottomSheetActionButton
            title="Backup manually"
            style={styles.manualBackupButton}
            onPress={() => navigate(ScreensEnum.ManualBackup)}
          />
        </View>
      </View>
    </Portal>
  );
};
