import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { formatSize } from 'src/styles/format-size';

import { Divider } from '../divider/divider';

import { useSeedPhraseWordGivenStyles } from './seed-phrase-word-given.styles';

interface SeedPhraseWordGivenProps {
  words: string[];
  index: number;
}

export const SeedPhraseWordGiven: FC<SeedPhraseWordGivenProps> = ({ words, index }) => {
  const styles = useSeedPhraseWordGivenStyles();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Word {index + 1}</Text>

      <Divider size={formatSize(6)} />

      <View style={styles.wordWrapper}>
        <Text style={styles.word}>{words[index]}</Text>
      </View>
    </View>
  );
};
