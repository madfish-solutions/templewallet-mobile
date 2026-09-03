import React from 'react';
import { Keyboard, TextInput, View } from 'react-native';

import { emptyFn } from 'src/config/general';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { isString } from 'src/utils/is-string';
import { setTestID } from 'src/utils/test-id.utils';

import { IconNameEnum } from '../icon/icon-name.enum';
import { TouchableIcon } from '../icon/touchable-icon/touchable-icon';
import { PatchedTextInput } from '../patched-text-input';

import { StyledTextInputProps } from './styled-text-input.props';
import { useStyledTextInputStyles } from './styled-text-input.styles';

export const StyledTextInput: FCWithRef<TextInput, StyledTextInputProps> = ({
  value,
  style,
  isError = false,
  isPasswordInput = false,
  isShowCleanButton = false,
  onChangeText = emptyFn,
  onBlur = emptyFn,
  testID,
  ref,
  ...props
}) => {
  const styles = useStyledTextInputStyles();
  const colors = useColors();

  const handleCleanButtonPress = () => {
    onBlur();
    Keyboard.dismiss();
    onChangeText('');
  };

  return (
    <View style={styles.view}>
      <PatchedTextInput
        ref={ref}
        style={[styles.regular, isError && styles.error, isPasswordInput && styles.passwordPadding, style]}
        placeholderTextColor={colors.gray1}
        selectionColor={colors.orange}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        {...props}
        {...setTestID(testID)}
      />
      {isShowCleanButton && isString(value) && (
        <View style={styles.cleanButton}>
          <TouchableIcon size={formatSize(16)} name={IconNameEnum.InputXCircle} onPress={handleCleanButtonPress} />
        </View>
      )}
    </View>
  );
};
