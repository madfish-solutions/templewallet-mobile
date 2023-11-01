import React, { forwardRef } from 'react';
import { Keyboard, TextInput, View } from 'react-native';

import { emptyFn } from '../../config/general';
import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';
import { isString } from '../../utils/is-string';
import { setTestID } from '../../utils/test-id.utils';
import { IconNameEnum } from '../icon/icon-name.enum';
import { TouchableIcon } from '../icon/touchable-icon/touchable-icon';

import { StyledTextInputProps } from './styled-text-input.props';
import { useStyledTextInputStyles } from './styled-text-input.styles';

export const StyledTextInput = forwardRef<TextInput, StyledTextInputProps>(
  (
    {
      value,
      style,
      isError = false,
      isPasswordInput = false,
      isShowCleanButton = false,
      onChangeText = emptyFn,
      onBlur = emptyFn,
      testID,
      ...props
    },
    ref
  ) => {
    const styles = useStyledTextInputStyles();
    const colors = useColors();

    const handleCleanButtonPress = () => {
      onBlur();
      Keyboard.dismiss();
      onChangeText('');
    };

    return (
      <View style={styles.view}>
        <TextInput
          ref={ref}
          style={[styles.regular, isError && styles.error, isPasswordInput && styles.passwordPadding, style]}
          placeholderTextColor={colors.gray3}
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
  }
);
