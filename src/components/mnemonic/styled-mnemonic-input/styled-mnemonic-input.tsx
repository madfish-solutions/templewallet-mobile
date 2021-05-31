import { useClipboard } from '@react-native-clipboard/clipboard';
import React, { FC, useCallback, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';

import { emptyFn } from '../../../config/general';
import { isString } from '../../../utils/is-string';
import { generateSeed } from '../../../utils/keys.util';
import { StyledTextInput, StyledTextInputProps } from '../../styled-text-input/styled-text-input';
import { Buttons } from './buttons/buttons';
import { Protected } from './protected/protected';
import { useStyledMnemonicInputStyles } from './styled-mnemonic-input.styles';

interface Props extends StyledTextInputProps {
  isInputMode: boolean;
  isShowGenerateNew: boolean;
}

const mnemonicInputTimerToShow = 12000;

export const StyledMnemonicInput: FC<Props> = ({
  isShowGenerateNew,
  isInputMode,
  onChangeText = emptyFn,
  value,
  ...props
}) => {
  const styles = useStyledMnemonicInputStyles();
  const [isProtected, setIsProtected] = useState(isString(value));

  const inputRef = useRef<TextInput>(null);

  const [data, setString] = useClipboard();

  const onReveal = useCallback(() => {
    setIsProtected(false);
    inputRef.current?.focus();
    if (!isInputMode) {
      setTimeout(() => setIsProtected(true), mnemonicInputTimerToShow);
    }
  }, [isInputMode, setIsProtected]);
  const onPaste = () => {
    inputRef.current?.focus();
    onChangeText(data);
  };
  const onGetNew = () => {
    inputRef.current?.focus();
    onChangeText(generateSeed());
  };
  const onCopy = () => setString(value || '');

  return (
    <View style={styles.view}>
      <StyledTextInput
        {...props}
        placeholder="e.g. cat, dog, coffee, ocean..."
        ref={inputRef}
        value={value}
        onChangeText={isInputMode ? onChangeText : emptyFn}
        onEndEditing={() => setIsProtected(true)}
        multiline
      />

      {isProtected ? (
        <Protected onReveal={onReveal} />
      ) : (
        <Buttons
          isInputMode={isInputMode}
          isShowGenerateNew={isShowGenerateNew}
          onCopy={onCopy}
          onPaste={onPaste}
          onGetNew={onGetNew}
        />
      )}
    </View>
  );
};
