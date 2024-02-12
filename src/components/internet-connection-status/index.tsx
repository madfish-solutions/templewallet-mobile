import { useNetInfo } from '@react-native-community/netinfo';
import { isNull } from 'lodash-es';
import React, { memo } from 'react';
import { Text, View } from 'react-native';

import { useInternetConnectionStatusStyles } from './styles';

export const InternetConnectionStatus = memo(() => {
  const { isConnected } = useNetInfo();
  const styles = useInternetConnectionStatusStyles();

  if (isNull(isConnected)) {
    return null;
  }

  return isConnected ? null : (
    <View style={styles.container}>
      <Text style={styles.text}>Disconnected</Text>
    </View>
  );
});
