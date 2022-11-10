import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { useNotificationCounterStyles } from './notification-counter.styles';

interface Props {
  count: number;
}

export const NotificationCounter: FC<Props> = ({ count }) => {
  const styles = useNotificationCounterStyles();

  return (
    <View style={styles.root}>
      <Text style={styles.text}>{count}</Text>
    </View>
  );
};
