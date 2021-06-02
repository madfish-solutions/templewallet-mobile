import React from 'react';
import { Text, View } from 'react-native';

import { formatSize } from '../../styles/format-size';
import { Divider } from '../divider/divider';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { useRevealAttentionStyles } from './reveal-attention.styles';

export const RevealAttention = () => {
  const styles = useRevealAttentionStyles();

  return (
    <View style={styles.container}>
      <Icon name={IconNameEnum.Alert} />
      <Divider size={formatSize(8)} />
      <View>
        <Text style={styles.title}>Attention!</Text>
        <Text style={styles.description}>DO NOT share this set of chars with anyone!</Text>
        <Text style={styles.description}>It can be used to steal your current account.</Text>
      </View>
    </View>
  );
};
