import React from 'react';
import { Alert, Button } from 'react-native';
import { useDispatch } from 'react-redux';

import { ScreenContainer } from '../../components/screen-container/screen-container';
import { rootStateResetAction } from '../../store/root-state.actions';
import { useShelter } from '../../shelter/shelter';

export const Settings = () => {
  const dispatch = useDispatch();
  const { lock } = useShelter();

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

  return (
    <ScreenContainer hasBackButton={false}>
      <Button title="Reset data" onPress={handleResetDataButtonPress} />
      <Button title="Lock app" onPress={lock} />
    </ScreenContainer>
  );
};
