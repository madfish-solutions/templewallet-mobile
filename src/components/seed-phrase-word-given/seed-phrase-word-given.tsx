import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { formatSize } from '../../styles/format-size';
import { Divider } from '../divider/divider';
import { useSeedPhraseWordGivenStyles } from './seed-phrase-word-given.styles';

type SeedPhraseWordGivenProps = {
  position: number;
  value: string;
};

export const SeedPhraseWordGiven: FC<SeedPhraseWordGivenProps> = ({ position, value }) => {
  const styles = useSeedPhraseWordGivenStyles();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Word {position + 1}</Text>

      <Divider size={formatSize(6)} />

      <View style={styles.wordWrapper}>
        <Text style={styles.word}>{value}</Text>
      </View>
    </View>
  );
};
