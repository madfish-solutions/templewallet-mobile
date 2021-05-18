import { useClipboard } from '@react-native-clipboard/clipboard';
import React, { FC, useCallback, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';

import { emptyFn } from '../../config/general';
import { generateSeed } from '../../utils/keys.util';
import { StyledTextInput, StyledTextInputProps } from '../styled-text-input/styled-text-input';
import { Buttons } from './components/buttons';
import { Protected } from './components/protected';
import { useStyledMnemonicInputStyles } from './styled-mnemonic-input.styles';

interface Props extends StyledTextInputProps {
  isEditable: boolean;
  isShowGetNew: boolean;
}

const mnemonicInputTimerToShow = 12000;

export const StyledMnemonicInput: FC<Props> = ({
  isShowGetNew,
  isEditable,
  onChangeText = emptyFn,
  value,
  ...props
}) => {
  const styles = useStyledMnemonicInputStyles();

  const [isProtected, setIsProtected] = useState(!isEditable);
  const inputRef = useRef<TextInput>(null);

  const [data, setString] = useClipboard();

  const onReveal = useCallback(() => {
    setIsProtected(false);
    if (isEditable) {
      inputRef?.current?.focus();
    } else {
      setTimeout(() => setIsProtected(true), mnemonicInputTimerToShow);
    }
  }, [isEditable, setIsProtected]);

  const onCopy = () => setString(value || '');
  const onPaste = () => onChangeText(data);
  const onGetNew = () => onChangeText(generateSeed());

  return (
    <View style={styles.view}>
      <StyledTextInput
        {...props}
        ref={inputRef}
        editable={isEditable}
        value={value}
        onChangeText={onChangeText}
        onEndEditing={() => setIsProtected(true)}
        multiline
      />
      <Buttons
        isEditable={isEditable}
        isProtected={isProtected}
        isShowGetNew={isShowGetNew}
        onCopy={onCopy}
        onPaste={onPaste}
        onGetNew={onGetNew}
      />

      {isProtected && <Protected onReveal={onReveal} />}
    </View>
  );
};
