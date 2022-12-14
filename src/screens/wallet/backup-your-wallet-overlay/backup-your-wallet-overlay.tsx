import { Portal } from '@gorhom/portal';
import React, { useContext } from 'react';
import { View, Text } from 'react-native';

import { BottomSheetActionButton } from '../../../components/bottom-sheet/bottom-sheet-action-button/bottom-sheet-action-button';
import { useDropdownBottomSheetStyles } from '../../../components/bottom-sheet/bottom-sheet.styles';
import { CurrentRouteNameContext } from '../../../navigator/current-route-name.context';
import { ScreensEnum } from '../../../navigator/enums/screens.enum';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { useIsManualBackupMadeSelector } from '../../../store/settings/settings-selectors';
import { useBackupYourWalletOverlayStyles } from './backup-your-wallet-overlay.styles';

export const BackupYourWalletOverlay = () => {
  const { navigate } = useNavigation();

  const styles = useBackupYourWalletOverlayStyles();
  const dropdownBottomSheetStyles = useDropdownBottomSheetStyles();

  const isManualBackupMade = useIsManualBackupMadeSelector();
  const currentRouteName = useContext(CurrentRouteNameContext);

  const isShowOverlay = currentRouteName === ScreensEnum.Wallet && !isManualBackupMade;

  return isShowOverlay ? (
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
            title="Manual backup"
            style={styles.manualBackupButton}
            onPress={() => navigate(ScreensEnum.ManualBackup)}
          />
        </View>
      </View>
    </Portal>
  ) : null;
};
