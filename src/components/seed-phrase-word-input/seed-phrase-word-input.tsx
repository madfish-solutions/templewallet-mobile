import { useField } from 'formik';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { formatSize } from '../../styles/format-size';
import { setTestID } from '../../utils/test-id.utils';
import { Divider } from '../divider/divider';
import { StyledTextInput } from '../styled-text-input/styled-text-input';

import { SeedPhraseWordInputSelectors } from './seed-phrase-word-input.selectors';
import { useSeedPhraseWordInputStyles } from './seed-phrase-word-input.styles';

interface SeedPhraseWordInputProps {
  inputName: string;
  index: number;
}

export const SeedPhraseWordInput: FC<SeedPhraseWordInputProps> = ({ inputName, index }) => {
  const styles = useSeedPhraseWordInputStyles();
  const [field, , helpers] = useField<string>(inputName);

  return (
    <View style={styles.container}>
      <Text style={styles.title} {...setTestID(SeedPhraseWordInputSelectors.wordTitle)}>
        Word {index + 1}{' '}
      </Text>

      <Divider size={formatSize(6)} />

      <StyledTextInput
        autoCapitalize="none"
        value={field.value}
        placeholder="Type word"
        onBlur={() => helpers.setTouched(true)}
        onChangeText={field.onChange(inputName)}
        style={styles.wordInput}
        textAlign="center"
        testID={SeedPhraseWordInputSelectors.wordInput}
      />
    </View>
  );
};
