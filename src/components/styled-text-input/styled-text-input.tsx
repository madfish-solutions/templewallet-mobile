import React, { FC } from 'react';
import { TextInput, TextInputProps, View } from 'react-native';

import { useColors } from '../../styles/use-colors';
import { IconNameEnum } from '../icon/icon-name.enum';
import { TouchableIcon } from '../icon/touchable-icon/touchable-icon';
import { useStyledTextInputStyles } from './styled-text-input.styles';

interface Props extends Omit<TextInputProps, 'style'> {
  isError?: boolean;
  isAllowCleanButton?: boolean;
}

export const StyledTextInput: FC<Props> = ({
  onChangeText,
  isAllowCleanButton,
  value,
  isError,
  multiline,
  ...props
}) => {
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
      {isAllowCleanButton && !!value && (
        <TouchableIcon
          name={IconNameEnum.XCircle}
          onPress={() => onChangeText && onChangeText('')}
          style={styles.cleanButton}
        />
      )}
    </View>
  );
};
