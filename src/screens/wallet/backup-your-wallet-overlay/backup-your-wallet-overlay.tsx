import { Portal } from '@gorhom/portal';
import React, { useContext } from 'react';
import { View, Text } from 'react-native';

import { BottomSheetActionButton } from 'src/components/bottom-sheet/bottom-sheet-action-button/bottom-sheet-action-button';
import { useDropdownBottomSheetStyles } from 'src/components/bottom-sheet/bottom-sheet.styles';
import { CurrentRouteNameContext } from 'src/navigator/current-route-name.context';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useIsAnyBackupMadeSelector } from 'src/store/settings/settings-selectors';
import { cloudTitle } from 'src/utils/cloud-backup';
import { useIsCloudAvailable } from 'src/utils/cloud-backup/use-is-available';

import { useBackupYourWalletOverlayStyles } from './backup-your-wallet-overlay.styles';
import { BackupYourWalletSelectors } from './backup-your-wallet.selectors';

export const BackupYourWalletOverlay = () => {
  const isAnyBackupMade = useIsAnyBackupMadeSelector();
  const currentRouteName = useContext(CurrentRouteNameContext);

  const isShowOverlay = currentRouteName === ScreensEnum.Wallet && !isAnyBackupMade;

  return isShowOverlay ? <OverlayComponent /> : null;
};

const OverlayComponent = () => {
  const { navigate } = useNavigation();

  const styles = useBackupYourWalletOverlayStyles();
  const dropdownBottomSheetStyles = useDropdownBottomSheetStyles();

  const cloudIsAvailable = useIsCloudAvailable();

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

          <BottomSheetActionButton
            title={`Backup to ${cloudTitle}`}
            disabled={!cloudIsAvailable}
            onPress={() => navigate(ScreensEnum.CloudBackup)}
            testID={BackupYourWalletSelectors.cloudBackupButton}
          />

          <BottomSheetActionButton
            title="Backup manually"
            style={styles.manualBackupButton}
            onPress={() => navigate(ScreensEnum.ManualBackup)}
            testID={BackupYourWalletSelectors.manuallyBackupButton}
          />
        </View>
      </View>
    </Portal>
  );
};
