import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import { resetApplicationAction } from 'src/store/root-state.actions';
import { useIsAnyBackupMadeSelector, useIsShowLoaderSelector } from 'src/store/settings/settings-selectors';

export const useResetDataHandler = () => {
  const dispatch = useDispatch();
  const isAnyBackupMade = useIsAnyBackupMadeSelector();
  const resetInProgress = useIsShowLoaderSelector();

  const resetData = useCallback(
    () =>
      Alert.alert(
        'Are you sure you want to reset the Temple Wallet?',
        isAnyBackupMade
          ? 'As a result, all your data will be deleted.'
          : 'Your wallet is NOT backed up. As a result, you will lose access to all your money!',
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
      ),
    [dispatch, isAnyBackupMade]
  );

  return { resetData, resetInProgress };
};
