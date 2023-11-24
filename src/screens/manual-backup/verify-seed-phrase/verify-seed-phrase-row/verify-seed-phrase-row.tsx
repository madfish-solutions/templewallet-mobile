import React, { FC } from 'react';
import { View } from 'react-native';

import { SeedPhraseWordGiven } from '../../../../components/seed-phrase-word-given/seed-phrase-word-given';
import { SeedPhraseWordInput } from '../../../../components/seed-phrase-word-input/seed-phrase-word-input';

import { useVerifySeedPhraseRowStyles } from './verify-seed-phrase-row.styles';

interface VerifySeedPhraseRowProps {
  inputName: string;
  index: number;
  words: string[];
}

export const VerifySeedPhraseRow: FC<VerifySeedPhraseRowProps> = ({ inputName, index, words }) => {
  const styles = useVerifySeedPhraseRowStyles();

  if (index === 0) {
    return (
      <View style={styles.container}>
        <SeedPhraseWordInput index={index} inputName={inputName} />
        <SeedPhraseWordGiven index={index + 1} words={words} />
        <SeedPhraseWordGiven index={index + 2} words={words} />
      </View>
    );
  }

  if (index === words.length - 1) {
    return (
      <View style={styles.container}>
        <SeedPhraseWordGiven index={index - 2} words={words} />
        <SeedPhraseWordGiven index={index - 1} words={words} />
        <SeedPhraseWordInput index={index} inputName={inputName} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SeedPhraseWordGiven index={index - 1} words={words} />
      <SeedPhraseWordInput index={index} inputName={inputName} />
      <SeedPhraseWordGiven index={index + 1} words={words} />
    </View>
  );
};
