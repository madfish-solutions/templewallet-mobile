import React from 'react';
import { Text, View } from 'react-native';

import { ConfirmationWindowStyles } from './confirmation-window.styles';

export const ConfirmationWindow = () => (
  <View style={ConfirmationWindowStyles.root}>
    <Text>Confirmation Window</Text>
  </View>
);
