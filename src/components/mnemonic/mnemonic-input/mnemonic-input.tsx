import Clipboard from '@react-native-clipboard/clipboard';
import React, { FC, useRef, useState } from 'react';
import { NativeSyntheticEvent, TextInput, TextInputFocusEventData, View } from 'react-native';

import { emptyFn } from '../../../config/general';
import { isString } from '../../../utils/is-string';
import { ButtonSmallSecondary } from '../../button/button-small/button-small-secondary/button-small-secondary';
import { StyledTextInput } from '../../styled-text-input/styled-text-input';
import { MnemonicProps } from '../mnemonic.props';
import { useMnemonicStyles } from '../mnemonic.styles';
import { ProtectedOverlay } from '../protected-overlay/protected-overlay';

export const MnemonicInput: FC<MnemonicProps> = ({ value, isError, onChangeText = emptyFn, onBlur = emptyFn }) => {
  const styles = useMnemonicStyles();

  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  const isShowOverlay = !isFocused && isString(value);

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(false);
    onBlur(e);
  };

  const handlePasteButtonPress = async () => {
    inputRef.current?.focus();
    onChangeText(await Clipboard.getString());
  };

  return (
    <View style={styles.container}>
      <StyledTextInput
        ref={inputRef}
        value={value}
        isError={isError}
        multiline={true}
        placeholder="e.g. cat, dog, coffee, ocean..."
        onBlur={handleBlur}
        onFocus={() => setIsFocused(true)}
        onChangeText={onChangeText}
      />
      <View style={styles.buttonsContainer}>
        <ButtonSmallSecondary title="Paste" onPress={handlePasteButtonPress} />
      </View>
      {isShowOverlay && <ProtectedOverlay onPress={() => inputRef.current?.focus()} />}
    </View>
  );
};
