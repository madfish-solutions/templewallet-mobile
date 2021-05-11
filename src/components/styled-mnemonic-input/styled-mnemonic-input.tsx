import React, { FC } from 'react';
import { TextInputProps, View } from 'react-native';

import { emptyFn } from '../../config/general';
import { StyledTextInput } from '../styled-text-input/styled-text-input';
import { Buttons } from './components/buttons';
import { Protected } from './components/protected';
import { useStyledMnemonicInputStyles } from './styled-mnemonic-input.styles';

interface Props extends Omit<TextInputProps, 'style'> {
  isError?: boolean;
  isShowCleanButton?: boolean;
  isProtected?: boolean;
}

export const StyledMnemonicInput: FC<Props> = ({ isProtected, onChangeText = emptyFn, value, ...props }) => {
  const styles = useStyledMnemonicInputStyles();

  return (
    <View style={styles.view}>
      <StyledTextInput value={value} multiline {...props} onChangeText={onChangeText} />
      <Buttons isProtected={isProtected} value={value} onChangeText={onChangeText} />

      {isProtected && <Protected />}
    </View>
  );
};
