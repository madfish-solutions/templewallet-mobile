import { useDispatch } from 'react-redux';
import { Alert } from 'react-native';

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
        text: 'OK',
        onPress: () => dispatch(rootStateResetAction())
      }
    ]);
};
