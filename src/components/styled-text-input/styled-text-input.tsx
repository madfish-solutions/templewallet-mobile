import React, { forwardRef } from 'react';
import { TextInput, TextInputProps, View, ViewStyle } from 'react-native';

import { EmptyFn, emptyFn } from '../../config/general';
import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';
import { isString } from '../../utils/is-string';
import { IconNameEnum } from '../icon/icon-name.enum';
import { TouchableIcon } from '../icon/touchable-icon/touchable-icon';
import { useStyledTextInputStyles } from './styled-text-input.styles';

export interface StyledTextInputProps extends TextInputProps {
  containerStyle?: ViewStyle;
  isError?: boolean;
  isPasswordInput?: boolean;
  isShowCleanButton?: boolean;
  onBlur?: EmptyFn;
}

export const StyledTextInput = forwardRef<TextInput, StyledTextInputProps>(
  (
    {
      containerStyle,
      value,
      style,
      isError = false,
      isPasswordInput = false,
      isShowCleanButton = false,
      onChangeText = emptyFn,
      onBlur = emptyFn,
      ...props
    },
    ref
  ) => {
    const styles = useStyledTextInputStyles();
    const colors = useColors();

    const handleCleanButtonPress = () => {
      onChangeText('');
      onBlur();
    };

    return (
      <View style={[styles.view, containerStyle]}>
        <TextInput
          ref={ref}
          style={[styles.regular, isError && styles.error, isPasswordInput && styles.passwordPadding, style]}
          placeholderTextColor={colors.gray3}
          selectionColor={colors.orange}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          {...props}
        />
        {isShowCleanButton && isString(value) && (
          <View style={styles.cleanButton}>
            <TouchableIcon size={formatSize(16)} name={IconNameEnum.InputXCircle} onPress={handleCleanButtonPress} />
          </View>
        )}
      </View>
    );
  }
);
