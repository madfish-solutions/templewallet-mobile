import React, { FC } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { useLoadingPlaceholderStyles } from './loading-placeholder.styles';

interface Props {
  text: string;
}

export const LoadingPlaceholder: FC<Props> = ({ text }) => {
  const styles = useLoadingPlaceholderStyles();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};
