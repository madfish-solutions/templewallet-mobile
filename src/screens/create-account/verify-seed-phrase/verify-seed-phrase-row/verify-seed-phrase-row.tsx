import React, { FC } from 'react';
import { View } from 'react-native';

import { SeedPhraseWordGiven } from '../../../../components/seed-phrase-word-given/seed-phrase-word-given';
import { SeedPhraseWordInput } from '../../../../components/seed-phrase-word-input/seed-phrase-word-input';
import { useVerifySeedPhraseRowStyles } from './verify-seed-phrase-row.styles';

type VerifySeedPhraseRowProps = {
  index: number;
  wordPosition: number;
  words: string[];
};

export const VerifySeedPhraseRow: FC<VerifySeedPhraseRowProps> = ({ index, wordPosition, words }) => {
  const styles = useVerifySeedPhraseRowStyles();

  if (wordPosition === 0) {
    return (
      <View style={styles.container}>
        <SeedPhraseWordInput index={index} position={0} />
        <SeedPhraseWordGiven position={1} value={words[1]} />
        <SeedPhraseWordGiven position={2} value={words[2]} />
      </View>
    );
  }

  if (wordPosition === words.length - 1) {
    return (
      <View style={styles.container}>
        <SeedPhraseWordGiven position={words.length - 3} value={words[words.length - 3]} />
        <SeedPhraseWordGiven position={words.length - 2} value={words[words.length - 2]} />
        <SeedPhraseWordInput index={index} position={words.length - 1} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SeedPhraseWordGiven position={wordPosition - 1} value={words[wordPosition - 1]} />
      <SeedPhraseWordInput index={index} position={wordPosition} />
      <SeedPhraseWordGiven position={wordPosition + 1} value={words[wordPosition + 1]} />
    </View>
  );
};
