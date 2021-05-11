import React, { FC } from 'react';
import { TextInputProps, View } from 'react-native';

import { emptyFn } from '../../config/general';
import { $getClipboardString } from '../../utils/handle-paste';
import { ButtonSmall } from '../button/button-small/button-small';
import { StyledTextInput } from '../styled-text-input/styled-text-input';
import { useStyledMnemonicInputStyles } from './styled-mnemonic-input.styles';

interface Props extends Omit<TextInputProps, 'style'> {
  isError?: boolean;
  isShowCleanButton?: boolean;
}

export const StyledMnemonicInput: FC<Props> = ({ onChangeText = emptyFn, value, ...props }) => {
  const styles = useStyledMnemonicInputStyles();

  const setString = () => {
    const subscription = $getClipboardString.subscribe(v => {
      onChangeText(v);
      subscription.unsubscribe();
    });
  };

  return (
    <View style={styles.view}>
      <StyledTextInput value={value} multiline {...props} onChangeText={onChangeText} />
      <View style={styles.buttonsContainer}>
        <ButtonSmall containerStyle={styles.buttonMargin} onPress={() => null} title={'Get New'} />
        <ButtonSmall containerStyle={styles.buttonMargin} onPress={() => null} title={'Copy'} />
        <ButtonSmall onPress={setString} title={'Paste'} />
      </View>
    </View>
  );
};
