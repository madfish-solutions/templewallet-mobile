import { Portal } from '@gorhom/portal';
import React, { useEffect, useRef } from 'react';
import { Text, View, Animated } from 'react-native';

import { BottomSheetActionButton } from 'src/components/bottom-sheet/bottom-sheet-action-button/bottom-sheet-action-button';
import { useDropdownBottomSheetStyles } from 'src/components/bottom-sheet/bottom-sheet.styles';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToScreen } from 'src/navigator/hooks/use-navigation.hook';
import { cloudIconName, cloudTitle } from 'src/utils/cloud-backup';
import { useIsCloudAvailable } from 'src/utils/cloud-backup/use-is-available';

import { useBackupYourWalletOverlayStyles } from './backup-your-wallet-overlay.styles';
import { BackupYourWalletSelectors } from './backup-your-wallet.selectors';

export const BackupYourWalletOverlay = () => {
  const navigateToScreen = useNavigateToScreen();

  const styles = useBackupYourWalletOverlayStyles();
  const dropdownBottomSheetStyles = useDropdownBottomSheetStyles();

  const cloudIsAvailable = useIsCloudAvailable();

  const translation = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    Animated.timing(translation, {
      toValue: 0,
      useNativeDriver: true
    }).start();
  }, []);

  return (
    <Portal>
      <View style={styles.backdrop}>
        <Animated.View
          style={[dropdownBottomSheetStyles.root, styles.root, { transform: [{ translateY: translation }] }]}
        >
          <View style={dropdownBottomSheetStyles.headerContainer}>
            <Text style={dropdownBottomSheetStyles.title}>Backup your wallet</Text>
            <Text style={dropdownBottomSheetStyles.description}>
              {'Don’t lose your wallet! Save your access\n' + 'to account using backup.'}
            </Text>
          </View>

          <BottomSheetActionButton
            title={`Backup to ${cloudTitle}`}
            iconLeftName={cloudIconName}
            style={styles.actionButton}
            titleStyle={styles.actionButtonText}
            disabled={cloudIsAvailable === false}
            onPress={() => void (cloudIsAvailable && navigateToScreen({ screen: ScreensEnum.CloudBackup }))}
            testID={BackupYourWalletSelectors.cloudBackupButton}
          />

          <BottomSheetActionButton
            title="Backup manually"
            iconLeftName={IconNameEnum.ManualBackup}
            style={[styles.actionButton, styles.manualBackupButton]}
            titleStyle={styles.actionButtonText}
            onPress={() => navigateToScreen({ screen: ScreensEnum.ManualBackup })}
            testID={BackupYourWalletSelectors.manuallyBackupButton}
          />
        </Animated.View>
      </View>
    </Portal>
  );
};
