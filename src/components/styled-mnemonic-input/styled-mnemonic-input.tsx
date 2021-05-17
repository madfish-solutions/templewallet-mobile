import { useClipboard } from '@react-native-clipboard/clipboard';
import React, { FC, useCallback, useRef, useState } from 'react';
import { TextInput, TextInputProps, View } from 'react-native';

import { emptyFn } from '../../config/general';
import { generateSeed } from '../../utils/keys.util';
import { StyledTextInput } from '../styled-text-input/styled-text-input';
import { Buttons } from './components/buttons';
import { Protected } from './components/protected';
import { useStyledMnemonicInputStyles } from './styled-mnemonic-input.styles';

interface Props extends Omit<TextInputProps, 'style'> {
  isError?: boolean;
  isShowCleanButton?: boolean;
  isEditable?: boolean;
  isHideGetNew?: boolean;
}

export const mnemonicInputTimerToShow = 12000;

export const StyledMnemonicInput: FC<Props> = ({
  isHideGetNew,
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
    inputRef?.current?.focus();
    if (!isEditable) {
      setTimeout(() => setIsProtected(true), mnemonicInputTimerToShow);
    }
  }, [isEditable, setIsProtected]);

  const onCopy = useCallback(() => setString(value || ''), [setString, value]);
  const onPaste = useCallback(() => onChangeText(data), [onChangeText, data]);
  const onGetNew = useCallback(() => onChangeText(generateSeed()), [onChangeText, generateSeed]);

  return (
    <View style={styles.view}>
      <StyledTextInput
        {...props}
        ref={inputRef}
        editable={!!isEditable}
        value={value}
        onChangeText={onChangeText}
        onEndEditing={() => setIsProtected(true)}
        multiline
      />
      <Buttons
        isEditable={isEditable}
        isProtected={isProtected}
        isHideGetNew={isHideGetNew}
        onCopy={onCopy}
        onPaste={onPaste}
        onGetNew={onGetNew}
      />

      {isProtected && <Protected onReveal={onReveal} />}
    </View>
  );
};
