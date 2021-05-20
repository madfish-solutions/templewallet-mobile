import React from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLink } from '../../../components/button/button-link/button-link';
import { rootStateResetAction } from '../../../store/root-state.actions';

export const EraseDataButton = () => {
  const dispatch = useDispatch();

  const handleResetDataButtonPress = () =>
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

  return <ButtonLink title="Erase Data" onPress={handleResetDataButtonPress} />;
};
