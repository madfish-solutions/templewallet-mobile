import React from 'react';
import { Text } from 'react-native';

import { AttentionMessage } from '../attention-message/attention-message';
import { useRevealAttentionStyles } from './reveal-attention.styles';

export const RevealAttention = () => {
  const styles = useRevealAttentionStyles();

  return (
    <AttentionMessage title="Attention!">
      <Text style={styles.description}>DO NOT share this set of chars with anyone!</Text>
      <Text style={styles.description}>It can be used to steal your current account.</Text>
    </AttentionMessage>
  );
};
