import { useField } from 'formik';
import React, { FC, useState } from 'react';
import { Text, View } from 'react-native';

import { formatSize } from '../../styles/format-size';
import { conditionalStyle } from '../../utils/conditional-style';
import { isString } from '../../utils/is-string';
import { Divider } from '../divider/divider';
import { StyledTextInput } from '../styled-text-input/styled-text-input';
import { useSeedPhraseWordInputStyles } from './seed-phrase-word-input.styles';

interface SeedPhraseWordInputProps {
  inputName: string;
  position: number;
}

export const SeedPhraseWordInput: FC<SeedPhraseWordInputProps> = ({ inputName, position }) => {
  const styles = useSeedPhraseWordInputStyles();
  const [field, , helpers] = useField<string>(inputName);
  const [shouldCenterCursor, setShouldCenterCursor] = useState(isString(field.value));

  const handleChange = (newValue: string) => {
    setShouldCenterCursor(isString(newValue));
    field.onChange(inputName)(newValue);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Word {position + 1}</Text>

      <Divider size={formatSize(6)} />

      <StyledTextInput
        autoCapitalize="none"
        multiline={false}
        value={field.value}
        placeholder="Type word"
        scrollEnabled={false}
        style={[styles.wordInput, conditionalStyle(shouldCenterCursor, styles.centeredCursorInput)]}
        onBlur={() => helpers.setTouched(true)}
        onChangeText={handleChange}
      />
    </View>
  );
};
