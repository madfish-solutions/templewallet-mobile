import React from 'react';
import { Text, View } from 'react-native';

import { formatSize } from '../../styles/format-size';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { useTokenHistoryPlaceholderStyles } from './token-history-placeholder.styles';

export const TokenHistoryPlaceholder = () => {
  const styles = useTokenHistoryPlaceholderStyles();

  return (
    <View style={styles.container}>
      <Icon name={IconNameEnum.NoResult} size={formatSize(120)} />
      <Text style={styles.text}>Operations will be available soon</Text>
    </View>
  );
};
