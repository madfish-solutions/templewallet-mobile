import React from 'react';
import { Text, View } from 'react-native';

import { AttentionMessage } from '../attention-message/attention-message';

import { useSeedPhraseAttentionStyles } from './new-seed-phrase-attention.styles';

export const NewSeedPhraseAttention = () => {
  const styles = useSeedPhraseAttentionStyles();

  return (
    <AttentionMessage>
      <View>
        <Text style={styles.description}>
          Write this phrase on a piece of paper and <Text style={styles.semibold}>store in a secure location. </Text>
          Or you can memorize it.
        </Text>
        <Text style={styles.description}>
          <Text style={styles.semibold}>DO NOT share</Text> this phrase with anyone! It can be used to steal all your
          accounts.
        </Text>
      </View>
    </AttentionMessage>
  );
};
