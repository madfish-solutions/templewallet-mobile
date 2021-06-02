import React, { forwardRef } from 'react';
import { TextInput, TextInputProps, View } from 'react-native';

import { emptyFn } from '../../config/general';
import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';
import { isString } from '../../utils/is-string';
import { IconNameEnum } from '../icon/icon-name.enum';
import { TouchableIcon } from '../icon/touchable-icon/touchable-icon';
import { useStyledTextInputStyles } from './styled-text-input.styles';

export interface StyledTextInputProps extends Omit<TextInputProps, 'style'> {
  isError?: boolean;
  isPasswordInput?: boolean;
  isShowCleanButton?: boolean;
}

export const StyledTextInput = forwardRef<TextInput, StyledTextInputProps>(
  (
    {
      value,
      multiline,
      isError = false,
      isPasswordInput = false,
      isShowCleanButton = false,
      onChangeText = emptyFn,
      ...props
    },
    ref
  ) => {
    const styles = useStyledTextInputStyles();
    const colors = useColors();

    return (
      <View style={styles.view}>
        <TextInput
          ref={ref}
          style={[
            multiline ? styles.multiline : styles.regular,
            isError && styles.error,
            isPasswordInput && styles.passwordPadding
          ]}
          multiline={multiline}
          placeholderTextColor={colors.gray3}
          selectionColor={colors.orange}
          value={value}
          onChangeText={onChangeText}
          {...props}
        />
        {isShowCleanButton && isString(value) && (
          <View style={styles.cleanButton}>
            <TouchableIcon size={formatSize(16)} name={IconNameEnum.InputXCircle} onPress={() => onChangeText('')} />
          </View>
        )}
      </View>
    );
  }
);
