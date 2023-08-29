import React, { FC, useMemo } from 'react';
import { Text } from 'react-native';

import { useActivityTimeStyles } from './activity-time.styles';

interface Props {
  timestamp: string;
}

export const ActivityTime: FC<Props> = ({ timestamp }) => {
  const styles = useActivityTimeStyles();

  const time = useMemo(
    () =>
      new Date(timestamp).toLocaleString('en-GB', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      }),
    [timestamp]
  );

  return <Text style={styles.text}>{time}</Text>;
};
