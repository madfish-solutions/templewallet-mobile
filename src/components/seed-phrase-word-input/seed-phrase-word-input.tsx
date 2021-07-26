import { useField } from 'formik';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { formatSize } from '../../styles/format-size';
import { Divider } from '../divider/divider';
import { StyledTextInput } from '../styled-text-input/styled-text-input';
import { useSeedPhraseWordInputStyles } from './seed-phrase-word-input.styles';

type SeedPhraseWordInputProps = {
  index: number;
  position: number;
};

export const SeedPhraseWordInput: FC<SeedPhraseWordInputProps> = ({ index, position }) => {
  const fieldName = `word${index}`;
  const styles = useSeedPhraseWordInputStyles();
  const [field, , helpers] = useField<string>(fieldName);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Word {position + 1}</Text>

      <Divider size={formatSize(6)} />

      <StyledTextInput
        autoCapitalize="none"
        value={field.value}
        placeholder="Type word"
        onBlur={() => helpers.setTouched(true)}
        onChangeText={field.onChange(fieldName)}
        style={styles.wordInput}
      />
    </View>
  );
};
