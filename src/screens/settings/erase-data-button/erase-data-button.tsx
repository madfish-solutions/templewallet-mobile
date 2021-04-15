import React from 'react';
import { useDispatch } from 'react-redux';
import { Alert, Button } from 'react-native';
import { rootStateResetAction } from '../../../store/root-state.actions';
import { red } from '../../../config/styles';

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

  return <Button title="Erase Data" color={red} onPress={handleResetDataButtonPress} />;
};
