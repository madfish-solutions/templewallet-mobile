import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import { resetApplicationAction } from '../store/root-state.actions';
import { useIsManualBackupMadeSelector } from '../store/settings/settings-selectors';

export const useResetDataHandler = () => {
  const dispatch = useDispatch();
  const isManualBackupMade = useIsManualBackupMadeSelector();

  return () =>
    Alert.alert(
      'Are you sure you want to reset the Temple Wallet?',
      isManualBackupMade
        ? 'As a result, all your data will be deleted.'
        : 'Your wallet is NOT backed up. As a result, you will lost access to all your money!',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => dispatch(resetApplicationAction.submit())
        }
      ]
    );
};
