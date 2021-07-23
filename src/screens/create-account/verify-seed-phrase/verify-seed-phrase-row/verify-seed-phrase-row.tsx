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

  const isFirstWord = wordPosition === 0;
  const isLastWord = wordPosition === words.length - 1;

  return (
    <View style={styles.container}>
      {isFirstWord ? (
        <SeedPhraseWordInput index={index} position={wordPosition} />
      ) : (
        <SeedPhraseWordGiven
          position={isLastWord ? wordPosition - 2 : wordPosition - 1}
          value={words[isLastWord ? wordPosition - 2 : wordPosition - 1]}
        />
      )}
      {isFirstWord || isLastWord ? (
        <SeedPhraseWordGiven
          position={isFirstWord ? wordPosition + 1 : wordPosition - 1}
          value={words[isFirstWord ? wordPosition + 1 : wordPosition - 1]}
        />
      ) : (
        <SeedPhraseWordInput index={index} position={wordPosition} />
      )}
      {isLastWord ? (
        <SeedPhraseWordInput index={index} position={wordPosition} />
      ) : (
        <SeedPhraseWordGiven
          position={isFirstWord ? wordPosition + 2 : wordPosition + 1}
          value={words[isFirstWord ? wordPosition + 2 : wordPosition + 1]}
        />
      )}
    </View>
  );
};
