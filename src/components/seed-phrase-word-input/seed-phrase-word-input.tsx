import { useField } from 'formik';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { formatSize } from '../../styles/format-size';
import { Divider } from '../divider/divider';
import { StyledTextInput } from '../styled-text-input/styled-text-input';
import { useSeedPhraseWordInputStyles } from './seed-phrase-word-input.styles';

type SeedPhraseWordInputProps = {
  inputName: string;
  position: number;
};

export const SeedPhraseWordInput: FC<SeedPhraseWordInputProps> = ({ inputName, position }) => {
  const styles = useSeedPhraseWordInputStyles();
  const [field, , helpers] = useField<string>(inputName);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Word {position + 1}</Text>

      <Divider size={formatSize(6)} />

      <StyledTextInput
        autoCapitalize="none"
        value={field.value}
        placeholder="Type word"
        onBlur={() => helpers.setTouched(true)}
        onChangeText={field.onChange(inputName)}
        style={styles.wordInput}
      />
    </View>
  );
};
