import React, { FC, useState } from 'react';
import { TextInput, TextInputProps, View } from 'react-native';

import { emptyFn } from '../../config/general';
import { useColors } from '../../styles/use-colors';
import { IconNameEnum } from '../icon/icon-name.enum';
import { TouchableIcon } from '../icon/touchable-icon/touchable-icon';
import { useStyledTextInputStyles } from './styled-text-input.styles';

interface Props extends Omit<TextInputProps, 'style'> {
  isError?: boolean;
  isShowCleanButton?: boolean;
}

export const StyledTextInput: FC<Props> = ({
  onChangeText = emptyFn,
  isShowCleanButton = false,
  isError = false,
  value,
  multiline,
  secureTextEntry,
  ...props
}) => {
  const [isSecureText, setIsSecureText] = useState(secureTextEntry);

  const styles = useStyledTextInputStyles();
  const colors = useColors();

  return (
    <View style={styles.view}>
      <TextInput
        style={[multiline ? styles.multiline : styles.regular, isError && styles.error]}
        multiline={multiline}
        placeholderTextColor={colors.gray3}
        selectionColor={colors.orange}
        value={value}
        onChangeText={onChangeText}
        {...props}
      />
      <>
        {isShowCleanButton && !!value && (
          <TouchableIcon name={IconNameEnum.XCircle} style={styles.cleanButton} onPress={() => onChangeText('')} />
        )}
        {secureTextEntry && (
          <>
            {isSecureText ? (
              <TouchableIcon onPress={() => setIsSecureText(false)} name={IconNameEnum.EyeOpenBold} />
            ) : (
              <TouchableIcon onPress={() => setIsSecureText(true)} name={IconNameEnum.EyeClosedBold} />
            )}
          </>
        )}
      </>
    </View>
  );
};
