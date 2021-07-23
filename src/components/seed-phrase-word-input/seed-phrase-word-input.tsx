import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { FormTextInput } from '../../form/form-text-input';
import { formatSize } from '../../styles/format-size';
import { Divider } from '../divider/divider';
import { useSeedPhraseWordInputStyles } from './seed-phrase-word-input.styles';

type SeedPhraseWordInputProps = {
  index: number;
  position: number;
};

export const SeedPhraseWordInput: FC<SeedPhraseWordInputProps> = ({ index, position }) => {
  const styles = useSeedPhraseWordInputStyles();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Word {position + 1}</Text>

      <Divider size={formatSize(6)} />

      <FormTextInput hideError={true} name={`word${index}`} style={styles.wordInput} />
    </View>
  );
};
