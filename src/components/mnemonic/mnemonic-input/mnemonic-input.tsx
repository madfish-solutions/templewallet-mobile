import Clipboard from '@react-native-clipboard/clipboard';
import React, { FC, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';

import { emptyFn } from '../../../config/general';
import { isString } from '../../../utils/is-string';
import { ButtonSmallSecondary } from '../../button/button-small/button-small-secondary/button-small-secondary';
import { StyledTextInput } from '../../styled-text-input/styled-text-input';
import { StyledTextInputStyles } from '../../styled-text-input/styled-text-input.styles';
import { MnemonicProps } from '../mnemonic.props';
import { MnemonicStyles } from '../mnemonic.styles';
import { ProtectedOverlay } from '../protected-overlay/protected-overlay';

export const MnemonicInput: FC<MnemonicProps> = ({ value, isError, onChangeText = emptyFn, onBlur = emptyFn }) => {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  const isShowOverlay = !isFocused && isString(value);

  const handleBlur = () => {
    setIsFocused(false);
    onBlur();
  };

  const handlePasteButtonPress = async () => {
    inputRef.current?.focus();
    onChangeText(await Clipboard.getString());
  };

  return (
    <View style={MnemonicStyles.container}>
      <StyledTextInput
        ref={inputRef}
        value={value}
        isError={isError}
        multiline={true}
        style={StyledTextInputStyles.mnemonicInput}
        placeholder="e.g. cat, dog, coffee, ocean..."
        onBlur={handleBlur}
        onFocus={() => setIsFocused(true)}
        onChangeText={onChangeText}
      />
      <View style={MnemonicStyles.buttonsContainer}>
        <ButtonSmallSecondary title="Paste" onPress={handlePasteButtonPress} />
      </View>
      {isShowOverlay && <ProtectedOverlay onPress={() => inputRef.current?.focus()} />}
    </View>
  );
};
