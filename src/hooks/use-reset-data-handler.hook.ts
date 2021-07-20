import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import { rootStateResetAction } from '../store/root-state.actions';

export const useResetDataHandler = () => {
  const dispatch = useDispatch();

  return () =>
    Alert.alert('Are you sure you want to reset the Temple Wallet?', 'As a result, all your data will be deleted.', [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => dispatch(rootStateResetAction.submit())
      }
    ]);
};
