import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { useAsyncStorageDetailsStyles } from './styles';

interface StatsRowProps {
  name: string;
  value: string;
}

export const StatsRow: FC<StatsRowProps> = ({ name, value }) => {
  const styles = useAsyncStorageDetailsStyles();

  return (
    <View style={styles.statsRow}>
      <Text style={styles.statsText}>{name}</Text>
      <Text style={styles.statsText}>{value}</Text>
    </View>
  );
};
