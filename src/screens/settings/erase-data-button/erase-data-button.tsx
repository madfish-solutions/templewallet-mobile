import React from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
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

  return <ButtonLargePrimary title="Erase Data" onPress={handleResetDataButtonPress} />;
};
