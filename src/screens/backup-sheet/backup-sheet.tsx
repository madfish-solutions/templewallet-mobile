import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { BottomSheet } from '../../components/bottom-sheet/bottom-sheet';
import { BottomSheetActionButton } from '../../components/bottom-sheet/bottom-sheet-action-button/bottom-sheet-action-button';
import { useBottomSheetController } from '../../components/bottom-sheet/use-bottom-sheet-controller';
import { Divider } from '../../components/divider/divider';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { showBackupModal } from '../../store/security/security-actions';
import { useIsBackupModalShown, useIsSeedPhraseVerified } from '../../store/security/security-selectors';
import { formatSize } from '../../styles/format-size';
import { useBackupSheet } from './backup-sheet.styles';

export const BackupSheet = () => {
  const styles = useBackupSheet();
  const dispatch = useDispatch();

  const { navigate } = useNavigation();
  const dropdownBottomSheetController = useBottomSheetController();
  const isVerified = useIsSeedPhraseVerified();
  const isShowModal = useIsBackupModalShown();

  useEffect(() => {
    if (isShowModal === true && isVerified === false) {
      console.log('call');
      const timer = setTimeout(() => {
        console.log('call 2');
        dropdownBottomSheetController.open();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isVerified, isShowModal, dropdownBottomSheetController]);

  const handleBackupManually = () => {
    dropdownBottomSheetController.close();
    dispatch(showBackupModal(false));
    navigate(ScreensEnum.BackupSettings);
  };

  const onClose = () => dispatch(showBackupModal(false));

  return (
    <BottomSheet
      cancelText={'Not now'}
      contentHeight={formatSize(186)}
      controller={dropdownBottomSheetController}
      onClose={onClose}
    >
      <View style={styles.sheetContainer}>
        <Text style={styles.header}>Backup your wallet</Text>
        <Divider size={formatSize(4)} />
        <Text style={styles.text}>Don't lose your wallet! Save your access</Text>
        <Text style={styles.text}>to accounts.</Text>
      </View>
      <View style={styles.divider} />
      <BottomSheetActionButton title="Backup manually" onPress={handleBackupManually} />
    </BottomSheet>
  );
};
