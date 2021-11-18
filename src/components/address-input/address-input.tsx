import Clipboard from '@react-native-clipboard/clipboard';
import React, { FC, useRef } from 'react';
import { TextInput, View } from 'react-native';

import { emptyFn } from '../../config/general';
import { isString } from '../../utils/is-string';
import { ButtonSmallSecondary } from '../button/button-small/button-small-secondary/button-small-secondary';
import { StyledTextInput } from '../styled-text-input/styled-text-input';
import { StyledTextInputProps } from '../styled-text-input/styled-text-input.props';
import { StyledTextInputStyles } from '../styled-text-input/styled-text-input.styles';
import { AddressInputStyles } from './address-input.styles';

type Props = Pick<StyledTextInputProps, 'value' | 'placeholder' | 'isError' | 'onBlur' | 'onChangeText'>;

export const AddressInput: FC<Props> = ({ value, placeholder, isError, onBlur, onChangeText = emptyFn }) => {
  const inputRef = useRef<TextInput>(null);

  const handlePasteButtonPress = async () => {
    inputRef.current?.focus();
    onChangeText(await Clipboard.getString());
  };

  return (
    <View style={AddressInputStyles.container}>
      <StyledTextInput
        ref={inputRef}
        value={value}
        placeholder={placeholder}
        multiline={true}
        autoCapitalize="none"
        style={StyledTextInputStyles.addressInput}
        isError={isError}
        isShowCleanButton={true}
        onBlur={onBlur}
        onChangeText={onChangeText}
      />
      {!isString(value) && (
        <View style={AddressInputStyles.buttonsContainer}>
          <ButtonSmallSecondary title="Paste" onPress={handlePasteButtonPress} />
        </View>
      )}
    </View>
  );
};
